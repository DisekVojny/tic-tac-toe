use crate::messages::*;

use std::sync::Arc;
use std::sync::atomic::{AtomicU16, Ordering};

use actix::{Actor, Context, Handler, Recipient};

#[derive(Default)]
pub struct State {
  pub counter: Arc<AtomicU16>,
  pub queue: Option<(u16, Recipient<Message>)>,
  pub games: Vec<Game>,
}

pub struct Game {
  player_1: (u16, Recipient<Message>),
  player_2: (u16, Recipient<Message>),
}

impl State {
  fn handle_disconnect(&mut self, id: u16) {
    if let Some(queue) = self.queue.as_ref() && queue.0 == id {
      self.queue = None;
      return;
    }

    let idx = self.games.iter().position(|game| game.player_1.0 == id || game.player_2.0 == id);
    if let Some(idx) = idx {
      let game = self.games.remove(idx);
      let other = if game.player_1.0 == id { game.player_2 } else { game.player_1 };
      other.1.do_send(Message(r#"{"type":"OpponentForfeit"}"#.to_string()));
    }
  }

  fn handle_connect(&mut self, id: u16, addr: Recipient<Message>) {
    match self.queue.take() {
      Some((id2, addr2)) => {
        self.start_game((id, addr), (id2, addr2));
      },
      None => {
        self.queue = Some((id, addr));
      }
    }
  }

  fn start_game(&mut self, p1: (u16, Recipient<Message>), p2: (u16, Recipient<Message>)) {
    let random = rand::random::<bool>();
    let starting = if random { p1.0 } else { p2.0 };
    
    let payload = format!(r#"{{"type":"GameStart","starting":{}}}"#, if starting == p1.0 { "true" } else { "false" });
    p1.1.do_send(Message(payload));

    let payload = format!(r#"{{"type":"GameStart","starting":{}}}"#, if starting == p2.0 { "true" } else { "false" });
    p2.1.do_send(Message(payload));

    let game = Game {
      player_1: p1,
      player_2: p2,
    };

    self.games.push(game);
  }
}

impl Actor for State {
  type Context = Context<Self>;
}

impl Handler<Message> for State {
  type Result = ();

  fn handle(&mut self, msg: Message, _: &mut Self::Context) {
    log::info!("Message: {}", msg.0);
  }
}

impl Handler<Connect> for State {
  type Result = u16;

  fn handle(&mut self, msg: Connect, _: &mut Self::Context) -> Self::Result {
    let id = self.counter.fetch_add(1, Ordering::Relaxed);
    self.handle_connect(id, msg.0);

    id
  }
}

impl Handler<Disconnect> for State {
  type Result = ();

  fn handle(&mut self, msg: Disconnect, _: &mut Self::Context) {
    self.handle_disconnect(msg.0);
  }
}

impl Handler<Move> for State {
  type Result = ();

  fn handle(&mut self, msg: Move, _: &mut Self::Context) {
    let game = self.games.iter_mut().find(|game| game.player_1.0 == msg.0 || game.player_2.0 == msg.0);
    if let Some(game) = game {
      let other: &(u16, Recipient<Message>) = if game.player_1.0 == msg.0 { &game.player_2 } else { &game.player_1 };
      other.1.do_send(Message(format!(r#"{{"type":"OpponentMove","payload":{}}}"#, msg.1)));
    }
  }
}