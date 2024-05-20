use actix::Recipient;

#[derive(actix::Message)]
#[rtype(result = "()")]
// pub struct Message(pub String);
pub enum Message {
  Text(String),
  Terminate
}

#[derive(actix::Message)]
#[rtype(u16)]
pub struct Connect (pub Recipient<Message>);

#[derive(actix::Message)]
#[rtype(result = "()")]
pub struct Disconnect (pub u16);

#[derive(actix::Message)]
#[rtype(result = "()")]
pub struct Move (pub u16, pub u8);

#[derive(actix::Message)]
#[rtype(result = "()")]
pub struct Terminate(pub u16);
