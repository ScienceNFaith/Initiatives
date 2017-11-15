function bubbleSortTurnorder(items) {
  var length = items.length;
  for (var i = 0; i < length; i++) { //Number of passes
    for (var j = 0; j < (length - i - 1); j++) { //Notice that j < (length - i)
      //Compare the adjacent positions
      if(items[j].pr < items[j+1].pr) {
        //Swap the numbers
        var tmp = items[j];  //Temporary variable to hold the current number
        items[j] = items[j+1]; //Replace current number with adjacent number
        items[j+1] = tmp; //Replace adjacent number with current number
      }
    }        
  }
  return items;
}

on("change:campaign:turnorder",function(){
    if(Campaign().get("initiativepage")==true){
        var turnorder;
        if(Campaign().get("turnorder") == "") turnorder = []; 
        else turnorder = JSON.parse(Campaign().get("turnorder"));
        
        var hasEndMarker = false;
        turnorder.forEach(function(turn){
            if(turn.id == '-1') hasEndMarker = true;
        });
        if(!hasEndMarker) {
            turnorder.push({
                id: "-1",
                pr: "0",
                custom: "End"
            });
        }
        
        if(turnorder[0].id == -1) {
            turnorder.forEach(function(turn){
                if(turn.id != -1){
                    var graphic = getObj("graphic", turn.id);
                    var character = getObj("character", graphic.get("represents"));
                    if(findObjs({type:'attribute', name:'dexterity', characterid:character.id })[0] != undefined) {
                        var dex = findObjs({type:'attribute', name:'dexterity', characterid:character.id })[0].get("current");
                        var dex_mod = Math.floor((dex - 10)/2);
                        var init = 0;
                        if (findObjs({type:'attribute', name:'initiative', characterid:character.id })[0] != undefined) init += parseInt(findObjs({type:'attribute', name:'initiative', characterid:character.id })[0].get("current"));
                        var bonus = parseInt(dex_mod+init);
                        var roll = randomInteger(20);
                        turn.pr = parseInt(roll+bonus);
                    }
                    else if(findObjs({type:'attribute', name:'npc_dexterity', characterid:character.id })[0] != undefined) {
                        var dex = findObjs({type:'attribute', name:'npc_dexterity', characterid:character.id })[0].get("current");
                        var dex_mod = Math.floor((dex - 10)/2);
                        var init = 0;
                        if (findObjs({type:'attribute', name:'npc_initiative', characterid:character.id })[0] != undefined) init += parseInt(findObjs({type:'attribute', name:'npc_initiative', characterid:character.id })[0].get("current"));
                        var bonus = parseInt(dex_mod+init);
                        var roll = randomInteger(20);
                        turn.pr = parseInt(roll+bonus);     
                    }
                    else {
                        sendChat('',`${character.get("name")} missing dexterity/npc-dexterity attribute.`);
                    }
                }
            });
            turnorder = bubbleSortTurnorder(turnorder);
        }
        Campaign().set("turnorder", JSON.stringify(turnorder));
    }
});