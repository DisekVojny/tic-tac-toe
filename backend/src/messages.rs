use actix::Recipient;

#[derive(actix::Message)]
#[rtype(result = "()")]
pub struct Message(pub String);

#[derive(actix::Message)]
#[rtype(u16)]
pub struct Connect (pub Recipient<Message>);

#[derive(actix::Message)]
#[rtype(result = "()")]
pub struct Disconnect (pub u16);