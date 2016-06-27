!# /bin/sh

# Download layers from naturalearthdata.com: ne_10m_admin_0_map_subunits
wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_map_subunits.zip

unzip ne_10m_admin_0_map_subunits.zip

# Convert data to GeoJSON format
ogr2ogr \
  -f GeoJSON \
  -where "continent = 'North America'" \
  continentNorthAmerica.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'South America'" \
  continentSouthAmerica.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'Europe'" \
  continentEurope.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'Africa'" \
  continentAfrica.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'Asia'" \
  continentAsia.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

ogr2ogr \
  -f GeoJSON \
  -where "continent = 'Oceania'" \
  continentOceania.json \
  ne_10m_admin_0_map_subunits/ne_10m_admin_0_map_subunits.shp

# Convert to TopoJSON format
topojson \
  -o northamerica.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentNorthAmerica.json

topojson \
  -o southamerica.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentSouthAmerica.json

topojson \
  -o europe.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentEurope.json

topojson \
  -o africa.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentAfrica.json

topojson \
  -o asia.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentAsia.json

topojson \
  -o oceania.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  continentOceania.json
