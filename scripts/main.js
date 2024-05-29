Events.on(WorldLoadEvent, event => {

    //if(event.unit.isPlayer()){
    print("Load map");
   //}

    if (Vars.state.rules.pvp) {
        print("This is PVP Game");
        Vars.ui.hudfrag.showToast("This is PVP Game");
    }
});

