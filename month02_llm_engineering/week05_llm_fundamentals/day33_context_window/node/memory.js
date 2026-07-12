const messages = [];

function addMessage(role, content) {
  messages.push({
    role,
    content,
  });
}

addMessage("System", "You are in AI Mentor.")

addMessage("user", "My name is Shubham.")

console.log(messages);

