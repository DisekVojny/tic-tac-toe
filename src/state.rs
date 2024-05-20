use crate::messages::*;

use std::sync::Arc;
use std::sync::atomic::{AtomicU16, Ordering};

use actix::{Actor, Context, Handler, Recipient};

#[derive(Default)]
pub struct State {
  pub counter: Arc<AtomicU16>,
  pub queue: Option<Recipient<Message>>,
  pub games: Vec<Game>,
}

pub struct Game {
  player_1: (u16, Recipient<Message>),
  player_2: (u16, Recipient<Message>),
  starting: u16,
  board: [u8; 9],
}

impl State {
  fn handle_disconnect(&mut self, id: u16) {
    println!("Player {} disconnected", id);
  }

  fn handle_connect(&mut self, id: u16, addr: Recipient<Message>) {
    println!("Player {} connected", id);
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