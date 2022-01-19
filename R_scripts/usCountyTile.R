library(tilemaps)
library(sf)
library(dplyr)
library(ggplot2)
library(jsonlite)
library(tidyverse)
library(stringr)
# setwd(dirname(rstudioapi::getActiveDocumentContext()$path))
setwd("C:/Users/Leonardo/OneDrive/Documents/TU_Delft/CodingProjects/ukWorkIncData/")

# data <- fromJSON("counties-10m.json", flatten = TRUE)
# install.packages("tilemaps")
# original_shapes <- st_read("USA_Counties/USA_Counties.shp")[,c("STATE_FIPS","FIPS","NAME", "STATE_NAME","geometry")]
original_shapes <- st_read("processed/USA_Counties_contiguous_final.shp")[,c("STATEFP","GEOID","NAME", "NAMELSAD","geometry")]#[,c("STATEFP","GEOID","NAME", "NAMELSAD","geometry")] # %>% st_set_crs(27700)
states<-read.csv("states/us-state-ansi-fips.csv")
names(states)[2] = "STATEFP"
# original_shapes <- filter(original_shapes, STATEFP==12) #original_shapes[original_shapes$STATEFP!=01]

# # filter for only contiguous (without hawai and alaska)
# original_shapes <- filter(original_shapes, STATE_FIPS!=02 & STATE_FIPS!=15)
original_shapes <- st_transform(original_shapes, 3857)
# keep only counties that are adjacent
# st_rook = function(a, b = a) st_relate(a, b, pattern = "F***1****")
# original_shapes %>% mutate(NB_ROOK = st_rook(.))

# generate tiles for all states
tile <- original_shapes %>%
  mutate(tile_map = generate_map(geometry, square = TRUE, flat_topped = TRUE))


ggplot(tile) +
  geom_sf(aes(geometry = tile_map))
+
#   geom_sf_text(aes(geometry = tile_map, label = NAME),
#                fun.geometry = function(x) st_centroid(x)) +
  theme_void()






# tileLonLat <- st_transform(st_centroid(tile$geometry), 4326)

tile$centroid = st_transform(st_centroid(tile$tile_map), 4326)
# tile$centroid = st_centroid(st_transform(tile$tile_map, 4326))
tile$x <- st_coordinates(tile$centroid)[,c("X")]
tile$y <- st_coordinates(tile$centroid)[,c("Y")]

# df <- data.frame(tile)[,c("STATE_FIPS","FIPS","NAME","STATE_NAME","x","y")]
df <- data.frame(tile)[,c("STATEFP","GEOID","NAME", "NAMELSAD","x","y")]
df$STATEFP <- str_remove(df$STATEFP, "^0+")
# df <- rename()

# merge with states names

# merge columns
df_final <- merge(x = df, y = states, by = "STATEFP", all.x = TRUE)[,c("GEOID","NAMELSAD","stname","stusps", "x","y")]
df_final$fullName <- str_c(df_final$NAMELSAD,", ",df_final$stname)
names(df_final)[2] = "county"
names(df_final)[3] = "state"
names(df_final)[4] = "abbrv"

# save data
# st_write(tile, "processed/florida.geojson", driver = "GeoJSON")
write.csv(x = df_final, file = 'processed/USA_countyTiles_square.csv')


# tile_map = generate_map(governors$geometry, square = FALSE, flat_topped = TRUE)

# add island to alaska
alaska_shapes <- st_read("processed/alaska_Counties_contiguous.shp")[,c("STATEFP","GEOID","NAME", "NAMELSAD","geometry")]#[,c("STATEFP","GEOID","NAME", "NAMELSAD","geometry")] # %>% st_set_crs(27700)
alaska_shapes <- st_transform(alaska_shapes, 3857)

tile_alaska <- alaska_shapes %>%
  mutate(tile_map = generate_map(geometry, square = TRUE, flat_topped = TRUE))


ggplot(tile_alaska) +
  geom_sf(aes(geometry = tile_map))
+
  #   geom_sf_text(aes(geometry = tile_map, label = NAME),
  #                fun.geometry = function(x) st_centroid(x)) +
  theme_void()

tile_alaska$centroid = st_transform(st_centroid(tile_alaska$tile_map), 4326)
# tile$centroid = st_centroid(st_transform(tile$tile_map, 4326))
tile_alaska$x <- st_coordinates(tile_alaska$centroid)[,c("X")]+45#165W to 120W
tile_alaska$y <- st_coordinates(tile_alaska$centroid)[,c("Y")]-27#52N to 25N

# df <- data.frame(tile)[,c("STATE_FIPS","FIPS","NAME","STATE_NAME","x","y")]
df_alaska <- data.frame(tile_alaska)[,c("STATEFP","GEOID","NAME", "NAMELSAD","x","y")]
df_alaska$STATEFP <- str_remove(df_alaska$STATEFP, "^0+")
# df <- rename()

# merge with states names

# merge columns
df_alaska_final <- merge(x = df_alaska, y = states, by = "STATEFP", all.x = TRUE)[,c("GEOID","NAME","stname","stusps", "x","y")]
df_alaska_final$fullName <- str_c(df_alaska_final$NAME,", ",df_alaska_final$stname)
names(df_alaska_final)[2] = "county"
names(df_alaska_final)[3] = "state"
names(df_alaska_final)[4] = "abbrv"

df_final_merged = rbind(df_final, df_alaska_final)
# save merged data
write.csv(x = df_final_merged, file = 'processed/USA_countyTiles_alaska_square.csv')
