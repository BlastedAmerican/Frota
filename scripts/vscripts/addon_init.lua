function Dynamic_Wrap( mt, name )
    if Convars:GetFloat( 'developer' ) == 1 then
        local function w(...) return mt[name](...) end
        return w
    else
        return mt[name]
    end
end

-- Server side setting of a preset game mode
Convars:RegisterConvar('frota_mode_preset', nil, 'Set to the game mode you want to start exclusively.', FCVAR_PROTECTED)
Convars:RegisterConvar('frota_ban_modes', nil, 'Set to modes banned on this server', FCVAR_PROTECTED)

-- Json stuff
require('json')
require('util')
require('frota')
require('gamemodes')

-- Include gamemodes
require('gamemodes/tinywars')
require('gamemodes/rvs')
require('gamemodes/warlocks')
require('gamemodes/invokerwars')
require('gamemodes/puckwars')
require('gamemodes/plage')
require('gamemodes/sunstrikewars')
require('gamemodes/kaolinwars')
require('gamemodes/kunkkawars')

-- Include addons
require('gamemodes/fatometer')


print("\n\nDone Loading!\n\n")
