// The unique ID on d2ware for this plugin
var pluginID = 'Frota';

// Allow our the map to change
console.findConVar('sv_hibernate_when_empty').setBool(false);

// A map of game modes that need custom maps
var maps = {
        "Dota": "dota",
        "Arena of the Dark Rift": "arenaotdr",
        "Evergreen Crossing": "evergreen_crossing",
        "Frostivus": "frostivus",
        "Keeper of the Kotol": "keeperofthekotol",
        "Labyrinth": "labyrinth0",
        "River Of Souls": "riverofsouls",
        "Runehill": "runehill"
}

// Have we changed the map?
var changedMap = false;

// Have we parsed settings?
var parsedSettings = false;

// Has map changing completed yet?
var doneChanging = false;

// The Map required for this gamemode
var requiredMap = 'dota_winter';

var settingsMap = {
    "Picking": {
        "Select options ingame (Ignore everything below)": "-",
        "Legends of Dota": "lod",
        "Random OMG": "romg",
        "All Pick": "allpick",
        "Pure Skill": "pureskill",
        "Invoker Wars": "INVOKERWARZ",
        "Puck Wars": "puckwars",
        "Tiny Wars": "tinywars",
        "Earth Spirit Wars": "kaolinwars",
        "Riki Wars": "rikiwars",
        "Kunkka Wars": "kunkkawars",
        "Defense of RuneHill": "dorh",
        "Plague": "plage"
    },

    "Gameplay": {
        "Select gameplay ingame": "-",
        "Dota": "dota",
        "PvP Arena": "arena",
        "King of the Hill": "kotolofthehill",
        "Oddball": "oddball",
        "Rabbits vs. Sheep": "rvs",
        "Zombie Survival": "survival"
    },

    "Free Blink Dagger": {
        "Disable Free Blink Dagger": "0",
        "Enable Free Blink Dagger": "1"
    },

    "Bonus Gold Per Second": {
        "Disable Bonus Gold Per Second": "0",
        "+1 Bonus Gold Per Second": "1",
        "+2 Bonus Gold Per Second": "2",
        "+5 Bonus Gold Per Second": "5",
        "+10 Bonus Gold Per Second": "10",
        "+15 Bonus Gold Per Second": "15",
        "+20 Bonus Gold Per Second": "20",
        "+25 Bonus Gold Per Second": "25"
    },

    "No Buying": {
        "Disable No Buying": "0",
        "Enable No Buying": "1"
    },

    "Fat-o-Meter": {
        "Disable Fat-o-Meter": "0",
        "Enable Fat-o-Meter": "1"
    },

    "Unlimited Mana": {
        "Disable Unlimited Mana": "0",
        "Enable Unlimited Mana": "1"
    },

    "Spawn Protection": {
        "Disable Spawn Protection": "0",
        "Enable Spawn Protection": "1"
    },

    "Lucky Items": {
        "Disable Lucky Items": "0",
        "Enable Lucky Items": "1"
    }
}

// This will contain the command to
var settingsCommand = null;

// Load in the lobby settings
plugin.get('LobbyManager', function(obj){
        // Attempt to grab options, make sure it exists
        var options = obj.getOptionsForPlugin(pluginID);
        if(!options) return;

        // Grab the name of the map they want
        var mapID = options['Map'];

        // Check if we need a custom map for this game mode
        var newMapID = maps[mapID];
        if(newMapID != null) {
            // Change the name of the map we want to play
            requiredMap = newMapID + ".bsp";
        }

        // Build settings list
        settings = {}

        for(var key in settingsMap) {
            settings[key] = (options[key] && settingsMap[key][options[key]]) || "-";
        }

        // Are we using D2Ware lobby maker?
        if(settings['Picking'] != '-') {
            // Build the settings command
            settingsCommand = 'd2wareSettings '
                                +settings['Picking'] + ' '
                                +settings['Gameplay'] + ' '
                                +settings['Free Blink Dagger'] + ' '
                                +settings['Bonus Gold Per Second'] + ' '
                                +settings['No Buying'] + ' '
                                +settings['Fat-o-Meter'] + ' '
                                +settings['Unlimited Mana'] + ' '
                                +settings['Spawn Protection'] + ' '
                                +settings['Lucky Items'];
        }

});

// Change the map if required
game.hook('OnGameFrame',function() {
    //server.print(game.rules.props.m_nGameState)
    // If we've already changed the map, don't change it again
    if(changedMap) {
        // Check if the map change has completed yet
        if(!doneChanging) {
            if(game.rules.props.m_nGameState < dota.STATE_HERO_SELECTION) doneChanging = true;
            return;
        }

        // Only pass settings ONCE
        if(parsedSettings) return;

        // Check if it's time to pass settings yet
        if(game.rules.props.m_nGameState >= dota.STATE_HERO_SELECTION) {
            // If there are settings, pass them
            if(settingsCommand) server.command(settingsCommand)

            // Store that we've passed the settings
            parsedSettings = true;
        }
    } else {
        // Change to the correct map
        server.command("dota_force_gamemode 15")
        server.command("dota_local_custom_enable 1")
        server.command("dota_local_custom_game Frota")
        server.command("dota_local_custom_map Frota")
        server.command("update_addon_paths")
        server.command("map " + requiredMap)

        // We've changed the map
        changedMap = true;
    }
});
