export function getConversations(){

return JSON.parse(
localStorage.getItem("conversations")
) || {};

}

export function saveConversations(data){

localStorage.setItem(
"conversations",
JSON.stringify(data)
);

}