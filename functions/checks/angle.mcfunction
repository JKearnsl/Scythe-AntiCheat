# Blocks invalid viewing angles

tag @s[rxm=-90,rx=90,rym=-180,ry=180] add noBadAngle

execute @s[tag=!noBadAngle] ~~~ function checks/alerts/anglenotif

tag @s[tag=noBadAngle] remove noBadAngle
