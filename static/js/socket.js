const OPCODES = {
    INFO: 0,
    HELLO: 1,
    INIT: 2,
    HEARTBEAT: 3,
};

const elements = {
    username: document.getElementById("username"),
    discriminator: document.getElementById("tag"),
    avatar: document.getElementById("avatar"),
    status: document.getElementById("status"),
    card: document.getElementById("profile"),
    stateX: document.getElementById("stateX"),
    gameX: document.getElementById("gameX")
};

const lanyard = new WebSocket("wss://api.lanyard.rest/socket");

// On Message
lanyard.onmessage = ({ data }) => {
    const parsedData = JSON.parse(data);

    if (parsedData.op == OPCODES.HELLO) {
        // Identify
        lanyard.send(
            JSON.stringify({
                op: OPCODES.INIT,
                d: {
                    subscribe_to_id: "938401082105806909",
                },
            })
        );

        // Interval
        setInterval(function () {
            lanyard.send(
                JSON.stringify({
                    op: OPCODES.HEARTBEAT,
                })
            );
        }, parsedData.d.heartbeat_interval);
    } else if (parsedData.op == OPCODES.INFO) {
        const statusColors = {
            online: "#2afa62",
            offline: "#747F8D",
            idle: "#eddf47",
            dnd: "#ff3640",
        };

        if (parsedData.t == "INIT_STATE") {
            const user = parsedData.d;

            elements.card.style.opacity = "1";
            elements.username.innerText = user.discord_user.username;
            elements.discriminator.innerText = `#${user.discord_user.discriminator}`;
            try{
if(user.activities){ var ela = "I'm in "+user.activities[1].name+" now."; var ela2 =1; }else{ var ela = ""}}
catch(err){ var ela=""; var ela2 = 0;}
            elements.stateX.innerText = "My Discord Status: "+user.activities[0].state;
            if(ela){elements.gameX.innerText = ela;elements.gameX.innerHTML = elements.gameX.innerHTML +'<img src="https://cdn.discordapp.com/app-assets/'+user.activities[1].application_id+'/'+user.activities[1].assets.large_image+'" >'}
            
            elements.avatar.src = `https://cdn.discordapp.com/avatars/938401082105806909/${user.discord_user.avatar}.gif?size=128`;
            elements.status.style.background =
                statusColors[user.discord_status];
        } else if (parsedData.t == "PRESENCE_UPDATE") {
            const user = parsedData.d;
            elements.status.style.background =
                statusColors[user.discord_status];
        }
    }
};
