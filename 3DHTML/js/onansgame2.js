const maxitemsinarea = 10;

let playerinventory = {
    slot0: enviroment_object_types.empty.new(),
    slot1: enviroment_object_types.empty.new(),
    slot2: enviroment_object_types.empty.new(),
    slot3: enviroment_object_types.empty.new(),
    slot4: enviroment_object_types.empty.new(),
    slot5: enviroment_object_types.empty.new(),
    slot6: enviroment_object_types.empty.new(),
    slot7: enviroment_object_types.empty.new(),
    slot8: enviroment_object_types.empty.new(),

    searchinventoryfor: function(itemname){
        for(i in [this.slot0,this.slot1,this.slot2,this.slot3,this.slot4,this.slot5,this.slot6,this.slot7,this.slot8]){
            if(i.name == itemname){
                return this.slot1;
            }
        }
    },
    listinventory: function(){
        itemdialogue = "The items in your inventory are: \n"
        slotnumber = 0
        for(i in [this.slot0,this.slot1,this.slot2,this.slot3,this.slot4,this.slot5,this.slot6,this.slot7,this.slot8]){
            itemdialogue = itemdialogue+"Item"+slotnumber+" has: "+i.name+"\n";

            slotnumber++;
        }
        return itemdialogue;
    },
    currentslot: 0,
    additemtoinventory: function(item){
        slotnumber = 0
        success = false;
        for(i in [this.slot0,this.slot1,this.slot2,this.slot3,this.slot4,this.slot5,this.slot6,this.slot7,this.slot8]){
            if(i.name == "empty"){
                this["slot"+str(slotnumber)] = item; 
                success = true;
                break; 
            }
            slotnumber++;
        }
        if(success){
            return{action: "pickup", dialogue:"you picked up the "+item.name};
        }
        else{
            return{action: "fail", dialogue:"you have no room for the "+item.name};
        }
    },
    new: function(){
        return JSON.parse(JSON.stringify(this));
    },
    removeHealth: function(num){
        this.health -= num;
        if(this.health < 0){
            this.health == 0;
        }
    },
    health: 150,
    currenttarget: enviroment_object_types.empty.new(),
    currentchunk: null,
    name: "player"
};



let enviroment_object_types = {
    empty: {
        name: "empty",
        pickupable: false,
        pickup: function(playerin){
            return {action:"fail", dialogue: "this is not an item!!"}
        },
        durability: 0,
        hasdurablity: false,
        new: function(){
            return JSON.parse(JSON.stringify(this));
        }
    },
    boulder: {
        name: "boulder",
        chunk: null,
        durability: 4,
        pickup: function(playerin){
            currentitem = playerin["slot"+str(playerin.currentslot)]
            if(currentitem.name == "pickaxe"){
                
                this.durability -= 1;
                itemresult = currentitem.removedurablility(1);
                if(this.durability <= 0){
                    this.name = "empty";
                    this.dropitems(playerin);
                    return {action: "harvested", dialogue: "broke down boulder"}+itemresult["dialouge"];
                }
                else{
                    return {action: "harvest", dialogue: "hit boulder"}+itemresult["dialouge"];
                }
            }
            else{
                return {action: "fail", dialogue: "can't mine"};
            }
            
        },
        dropitems: function(playerin){
            for(i=0;i<parseInt((Math.random()*4)+"");i++){
                playerin.currentchunk.items.add("rock".new());
            }
        },
        new: function(){
            return JSON.parse(JSON.stringify(this));
        }
    },

    carrot: {
        name: "carrot",
        pickup: function(playerin){
            pickupresult = playerin.additemtoinventory(this.new());
            if(pickupresult["action"] == "success"){
                this.harvested = true;
                return {action: "harvested", dialogue: "picked the carrot"};
            }

        },
        new: function(){
            return JSON.parse(JSON.stringify(this));
        }
    },
    flint: {
        name: "flint",
        pickup: function(playerin){
            playerin.additemtoinventory(this);
            return {action: "pickup", dialogue: "picked up flint"};
        },
        new: function(){
            return JSON.parse(JSON.stringify(this));
        }
    },
    sapling: {
        name: "sapling",
        harvested: false,
        pickup: function(playerin){
            if(!this.harvested){
                pickupresult = playerin.additemtoinventory(stick.new());
                if(pickupresult["action"] == "success"){
                    this.harvested = true;
                    return {action: "harvested", dialogue: "picked the sapling"};
                }
                playerin.currentchunk.items.add(enviroment_object_types["stick"].new());
                return {action: "harvested", dialogue: "picked the sapling. You couldn't hold the stick so it drops on the ground."};
                
                
            }
            return {action:"fail", dialogue: "This sapling has been plucked of all it's branches."};
        },
        new: function(){
            
            return JSON.parse(JSON.stringify(this));
        }
    },
    stick: {
        pickup: function(playerin){
            pickupresult = playerin.additemtoinventory(this.new());
            if(pickupresult["action"] == "success"){
                this.name = "empty";
            }
            return pickupresult;
        },
        new: function(){
            
            return JSON.parse(JSON.stringify(this));
        }
    },
    rock: {
        name: "rock",
        pickup: function(playerin){
            pickupresult = playerin.additemtoinventory(this.new());
            if(pickupresult["action"] == "success"){
                this.name = "empty";
            }
            return pickupresult;
        },
        new: function(){
            
            return JSON.parse(JSON.stringify(this));
        }
    },

    pickaxe: {
        name: "pickaxe",
        durability: 10,
        pickup: function(playerin){
            pickupresult = playerin.additemtoinventory(this.new());
            if(pickupresult["action"] == "success"){
                this.name = "empty";
            }
            return pickupresult;
        },
        new: function(){
            return JSON.parse(JSON.stringify(this));
        },
        removedurablility: function(damage){
            this.health -= damage;
            if(this.health <= 0){
                return {action:"break", dialogue: "Your "+this.name+" broke!"}
            }
        }
    },

    axe:{
        name:"axe",
        durability:10,
        pickup: function(playerin){
            pickupresult = playerin.additemtoinventory(this.new());
            if(pickupresult["action"] == "success"){
                this.name = "empty";
            }
            return pickupresult;
        },
        new: function(){
            return JSON.parse(JSON.stringify(this));
        },
        removedurablility: function(damage){
            this.health -= damage;
            if(this.health <= 0){
                return {action:"break", dialogue: "Your "+this.name+" broke!"}
            }
        }
    },
    spear:{
        name:"spear",
        durability:15,
        pickup: function(playerin){
            pickupresult = playerin.additemtoinventory(this.new());
            if(pickupresult["action"] == "success"){
                this.name = "empty";
            }
            return pickupresult;
        },
        new: function(){
            return JSON.parse(JSON.stringify(this));
        },
        removedurablility: function(damage){
            this.health -= damage;
            if(this.health <= 0){
                return {action:"break", dialogue: "Your "+this.name+" broke!"};
            }
            return {action:"use", dialogue: ""};
        }
    },


    spider: {
        name: "spider",
        pickup: function(playerin){
            playerin.removeHealth(10);
            return {action:"fail", dialogue: "the spider bit you trying to pick it up. -10 health."};
        },
        new: function(){
            return JSON.parse(JSON.stringify(this));
        },
        removehealth: function(damage){
            this.health -= damage;
            if(this.health <= 0){
                this.name = "empty";
                return {action: "victory", dialogue:"You killed the spider"};
            }
            return {action: "attack", dialogue:"You attacked the spider"};
        },
        health: 60
    },

    spidercave: {
        name: "spidercave",
        pickup: function(playerin){
            this.health -= 1;
            if(this.health <= 0){
                this.name = "empty";
                return {action: "harvested", dialogue: "the spidercave breaks into dust."};
            }
            return {action: "harvest", dialogue: "you hit the spider cave"};
        },
        new: function(){
            return JSON.parse(JSON.stringify(this));
        },
        health: 5
    },

    tree:{
        name: "tree",
        durability:4,
        pickup: function(playerin){
            currentitem = playerin["slot"+str(playerin.currentslot)]
            if(currentitem.name == "axe"){
                
                this.durability -= 1;
                itemresult = currentitem.removedurablility(1);
                if(this.durability <= 0){
                    this.name = "empty";
                    this.dropitems(playerin);
                    return {action: "harvested", dialogue: "chopped down tree"+itemresult["dialouge"]};
                }
                else{
                    return {action: "harvest", dialogue: "hit tree"}+itemresult["dialouge"];
                }
            }
            else{
                return {action: "fail", dialogue: "can't chop"};
            }
            
        },
        dropitems: function(playerin){
            for(i=0;i<parseInt(((Math.random()*4)+4)+"");i++){
                playerin.currentchunk.items.add(enviroment_object_types[random.choice(list({
                        1:"log",
                        1:"log",
                        1:"log",
                        1:"log",
                        1:"stick",
                        2:"stick"
                    }))].new());
            }
        },
        new: function(){
            return JSON.parse(JSON.stringify(this));
        },
        breakitem: function(){
            this.name = "empty";
        }
    }



};


let world = {
    players:{},
    data: [[]],
    time: 0,
    moveplayer(playerin,x,y){
        if(this.data[0].length() < playerin.xpos+x && playerin.xpos+x >= 0){
            if(this.data.length() < playerin.ypos+y && playerin.ypos+y >= 0){
                playerin.ypos += y;
                playerin.xpos += x;
                playerin.currentchunk = this.data[playerin.xpos][playerin.ypos];
                return "moved";
            }
        }
        return "outsideworld";
    },


    biomes: {
        biometypes:{
            biome_forest: {1: "carrot",2: "tree", 3: "sapling", 4: "flint"},
            biome_spider: {1: "spidercave",2:"spider"}
        },
        randomchoice: function(){
            return random.choice(list(this.biometypes.values()));
        }
    },
    chunk: {
        items:[],

        new: function(){
            return JSON.parse(JSON.stringify(this));
        },
    },
    generateworld: function(x,y){

        for(i = 0;i<x;i++){
            this.data.push([]);
            for(k=0;k<y;k++){
                this.data[x].push(this.generatechunk());
            }
        }
    },
    generatechunk: function(){
        let newchunk = this.chunk.new();
        var biome = biomes.randomchoice();


        for(i=0;i<parseInt((Math.random()*maxitemsinarea)+"");i++){
            
            newchunk.items.push(enviroment_object_types[random.choice(list(biome))].new());
        }
        return newchunk;
    }
};
var thisworld;
var player1;
function startworld(){
    
    thisworld = world.new();
    player1 = playerinventory.new();
    player1.name = "player1";
    thisworld.players.add(player1);
    thisworld.generate(10,10);
    player1.xpos = 5;
    player1.ypos = 5;
    player1.currentchunk = newworld.data[player1.xpos][player1.ypos];
}

function timehandler(timepassed){
    let isday = thisworld.time > 0 && thisworld.time < 12000;
    thisworld.time += timepassed;
    if(isday && !(thisworld.time > 0 && thisworld.time < 12000)){
        return "It is now nighttime! Better be near a campfire!";
    }
    if(thisworld.time > 24000){
        thisworld.time = 0;
        return "It is now daytime.";
    }
    if(thisworld.time < 0){
        thisworld.time = 0;
        return "It is now daytime.";
    }
    if(thisworld.time > 0 && thisworld.time < 12000){
        return "The time in military is: "+parseInt((thisworld.time/1000)+"")+":"+parseInt((((thisworld.time%1000)/1000)*60)+"");
    }
    if(thisworld.time > 11000 && thisworld.time < 12000){
        return "The time in military is: "+parseInt((thisworld.time/1000)+"")+":"+parseInt((((thisworld.time%1000)/1000)*60)+""+" The sun is setting.");
    }
    else{
        for(item in player1.currentchunk.items){
            if(item.name == "campfire"){
                thisworld.time = 0;
                return "you sleep by the campfire. it turns daytime.";
            }
        }
        
        player1.health -= 50;
        return "OWCH!! Something in the darkness is attacking me!! (minus 50 health)";
    }
}

function inputcommand(input){
    commandsplit = input.split(" ");
    if(player1.health <= 0){
        return "Game Over!";
    }
    else{
        //move function.
        if(commandsplit[0] == "move"){
            if(commandsplit[1] == "up"){
                returned = thisworld.moveplayer(player1,0,1);
                if(returned == "move"){
                    
                    return "You moved up 1."+timehandler(200);
                    
                }
                else if(returned == "outsideworld"){
                    return "the ocean blocks your way.";
                }
            }
            else if(commandsplit[1] == "down"){
                returned = thisworld.moveplayer(player1,0,-1);
                if(returned == "move"){
                    return "You moved down 1."+timehandler(200);
                }
                else if(returned == "outsideworld"){
                    return "the ocean blocks your way.";
                }
            }
            else if(commandsplit[1] == "left"){
                returned = thisworld.moveplayer(player1,1,0);
                if(returned == "move"){
                    return "You moved left 1."+timehandler(200);
                }
                else if(returned == "outsideworld"){
                    return "the ocean blocks your way.";
                }
            }
            else if(commandsplit[1] == "right"){
                returned = thisworld.moveplayer(player1,-1,0);
                if(returned == "move"){
                    return "You moved right 1."+timehandler(200);
                }
                else if(returned == "outsideworld"){
                    return "the ocean blocks your way.";
                }
            }
            else{
                return "That is not a valid direction! Valid directions are: \"up\",\"down\",\"left\",\"right\"";
            }
        }

        if(commandsplit[0] == "attack"){
            
            if(parseInt(commandsplit[1])){
                j = 0;
                spiders = {};
                counter = 0;
                for(i in player1.currentchunk.items){
                    if(i.name == "spider"){
                        
                        spiders[j] = counter;
                        j += 1;
                    }
                    counter += 1;
                }
                if(parseInt(commandsplit[1]) <= j && parseInt(commandsplit[1]) > 0){
                    if(playerin["slot"+str(playerin.currentslot)].name == "spear"){
                        let result = player1.currentchunk.items[spiders[parseInt(commandsplit[1])-1]].removehealth(30);
                        let itemresult = playerin["slot"+str(playerin.currentslot)].removedurablility(1);
                        if(result["action"] == "attack"){
                            return result["dialouge"]+" with a spear. it takes 30 damage."+itemresult["dialogue"]+timehandler(40);
                        }
                        else{
                            return result["dialouge"]+" with a spear";
                        }
                    }
                    else if (playerin["slot"+str(playerin.currentslot)].name == "pickaxe"){
                        let result = player1.currentchunk.items[spiders[parseInt(commandsplit[1])-1]].removehealth(20);
                        playerin["slot"+str(playerin.currentslot)].durability -= 1;
                        if(result["action"] == "attack"){
                            return result["dialouge"]+" with a pickaxe. it takes 20 damage."+timehandler(40);
                        }
                        else{
                            return result["dialouge"]+" with a pickaxe";
                        }
                    }
                    else if (playerin["slot"+str(playerin.currentslot)].name == "axe"){
                        let result = player1.currentchunk.items[spiders[parseInt(commandsplit[1])-1]].removehealth(25);
                        playerin["slot"+str(playerin.currentslot)].durability -= 1;
                        if(result["action"] == "attack"){
                            return result["dialouge"]+" with an axe. it takes 25 damage."+timehandler(40);
                        }
                        else{
                            return result["dialouge"]+" with an axe";
                        }
                    }
                    else{
                        return "can't attack a spider with a "+playerin["slot"+str(playerin.currentslot)].name;
                    }
                }
                else{
                    return "There is no spider here with that number.";
                }
                
            }
            else{
                return "second argument must be a number!"
            }
        }


        if(commandsplit[0] == "pickup" || commandsplit[0] == "harvest"){
            if(parseInt(commandsplit[1])){
                if(parseInt(commandsplit[1]) < player1.currentchunk.items.length && parseInt(commandsplit[1]) >= 0){
                    return player1.currentchunk.items[parseInt(commandsplit[1])].pickup(player1)["dialouge"]+timehandler(40);
                }
                else{
                    return "There is no item or enviroment object with that number!";
                }
            }
            else{
                return "second argument must be a number!"
            }
        }   




        //LAST!!!
        if(player1.health <= 0){
            return "Game Over!";
        }
    }
}









