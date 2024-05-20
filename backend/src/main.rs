#![feature(let_chains)]

use socket::Player;

use std::{io, env};

use actix::{Actor, Addr};
use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use actix_web_actors::ws;

mod cors;
mod messages;
mod socket;
mod state;

// pub type AppState = web::Data<Arc<RwLock<state::State>>>;
pub type StateAddr = web::Data<Addr<state::State>>;

#[actix_web::main]
async fn main() -> io::Result<()>{
  if env::var("RUST_LOG").is_err() {
    env::set_var("RUST_LOG", "info");
  }

  pretty_env_logger::init();

  let port: u16 = env::var("PORT").map_or(2137, |p| p.parse().unwrap_or(2137));
  log::info!("Starting the application on port {}", port);

  let state = state::State::default();
  let addr = state.start();

  HttpServer::new(move || {
    App::new()
      .wrap(cors::Cors)
      .app_data(StateAddr::new(addr.clone()))
      .route("/", web::get().to(index))
      .route("/api/queue", web::get().to(queue))
  })
  .bind(("0.0.0.0", port))?
  .run()
  .await
}

async fn index() -> impl Responder {
  ""
}

async fn queue(req: HttpRequest, stream: web::Payload, sockets: StateAddr) -> Result<HttpResponse, actix_web::Error> {
  let session = Player::new(sockets.get_ref().clone());
  ws::start(session, &req, stream)
}