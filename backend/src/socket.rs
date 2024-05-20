use crate::messages::*;
use crate::state::State;

use std::time::{Duration, Instant};

use actix_web_actors::ws;
use actix::{
  fut,
  Actor,
  ActorContext,
  Addr,
  AsyncContext,
  Handler,
  Running,
  StreamHandler,
  WrapFuture,
  ActorFutureExt,
  ContextFutureSpawner,
};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(5);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(10);
pub struct Player {
  pub id: u16,
  pub addr: Addr<State>,
  pub last_heartbeat: Instant,
}

impl Player {
  pub fn new(addr: Addr<State>) -> Self {
    Self { id: 0, addr, last_heartbeat: Instant::now() }
  }

  fn hb(&self, ctx: &mut ws::WebsocketContext<Self>) {
    ctx.run_interval(HEARTBEAT_INTERVAL, |socket, ctx| {
      if Instant::now().duration_since(socket.last_heartbeat) <= CLIENT_TIMEOUT {
        ctx.ping(b"");
        return;
      }

      log::info!("Disconnecting due to lack of heartbeat");
      socket.addr.do_send(Disconnect (socket.id));
      ctx.stop();
    });
  }
}

impl Actor for Player {
  type Context = ws::WebsocketContext<Self>;

  fn started(&mut self, ctx: &mut Self::Context) {
    log::info!("Socket connected");
    self.hb(ctx);

    let addr = ctx.address();
    self.addr
      .send(Connect (addr.recipient()))
      .into_actor(self)
      .then(|res, act, ctx| {
        match res {
          Ok(id) => act.id = id,
          _ => ctx.stop(),
        }

        fut::ready(())
      })
      .wait(ctx);
  }

  fn stopping(&mut self, _: &mut Self::Context) -> Running {
    log::info!("Socket disconnected");
    self.addr.do_send(Disconnect (self.id));
    Running::Stop
  }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for Player {
  fn handle(&mut self, item: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
    let msg = match item {
      Ok(msg) => msg,
      Err(_) => {
        ctx.stop();
        return;
      }
    };

    match msg {
      ws::Message::Ping(msg) => {
        self.last_heartbeat = Instant::now();
        ctx.pong(&msg);
      },
      ws::Message::Pong(_) => {
        self.last_heartbeat = Instant::now();
      },
      ws::Message::Text(text) => {
        if text == "terminate" {
          self.addr.do_send(Terminate (self.id));
          return;
        }

        let idx = text.parse::<u8>().unwrap_or(0);
        self.addr.do_send(Move (self.id, idx));
      }
      ws::Message::Binary(bin) => ctx.binary(bin),
      ws::Message::Close(reason) => {
        log::info!("Closing the connection: {:?}", reason);
        ctx.close(reason);
        ctx.stop();
      },
      _ => (),
    }
  }
}

impl Handler<Message> for Player {
  type Result = ();

  fn handle(&mut self, msg: Message, ctx: &mut Self::Context) {
    match msg {
      Message::Text(text) => ctx.text(text),
      Message::Terminate => ctx.stop(),
    }
  }
}
