import { Html } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useState, useEffect } from "react";
import type { Vector3 } from "three";
import { TextureLoader, NearestFilter } from "three";

import Loading from "./Loading";
import { Plant } from "../stores/GanjaFarmStore";
interface GardenTileProps {
  position: Vector3;
  state?: Plant | null;
  num: number;
}

const timeToHarvest = 60; //fixme брать из бекенда

export default function GardenTile({ position, state, num }: GardenTileProps) {
  const [tileState, setTileState] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<"loading" | "loaded">("loading");
  const [
    seedTexture,
    plantTexture1,
    plantTexture2,
    plantTexture3,
    plantTexture4,
    finalTexture,
  ] = useLoader(TextureLoader, [
    "./images/seeds.png",
    "./images/tomato_plant_1.png",
    "./images/tomato_plant_2.png",
    "./images/tomato_plant_3.png",
    "./images/tomato_plant_4.png",
    "./images/tomato_plant_final.png",
  ]);
  seedTexture.magFilter = NearestFilter;
  plantTexture1.magFilter = NearestFilter;
  plantTexture2.magFilter = NearestFilter;
  plantTexture3.magFilter = NearestFilter;
  plantTexture4.magFilter = NearestFilter;
  finalTexture.magFilter = NearestFilter;

  useEffect(() => {
    setStatus("loading");

    const updateTileState = () => {
      if (state == null) {
        setTileState(undefined);
      } else if (state != null && state.timePlanted) {
        const now = Date.now();
        const planted = state.timePlanted;
        let diff = (now - planted) / 1000; // diff in seconds
        const progress = Math.min((diff / timeToHarvest) * 20, 20); // Scale to 20 stages
        setTileState(Math.floor(progress));
      }
    };

    // Update immediately
    updateTileState();
    setStatus("loaded");

    // Then update every second
    const intervalId = setInterval(updateTileState, 1000);

    // Clean up interval on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [state, timeToHarvest]);

  return (
    <>
      {status === "loading" && (
        <Html position={[position.x - 0.1, position.y + 0.1, position.z]}>
          <Loading />
        </Html>
      )}

      {tileState !== undefined && status === "loaded" && (
        <>
          {tileState < 4 && (
            <sprite
              scale={[0.7, 0.7, 0.7]}
              position={[position.x, position.y + 0.05, 0.5]}
            >
              <spriteMaterial attach="material" map={seedTexture} />
            </sprite>
          )}
          {tileState < 8 && tileState >= 4 && (
            <sprite
              scale={[1, 1, 1]}
              position={[position.x, position.y + 0.2, 0.5]}
            >
              <spriteMaterial attach="material" map={plantTexture1} />
            </sprite>
          )}
          {tileState < 12 && tileState >= 8 && (
            <sprite
              scale={[1, 1, 1]}
              position={[position.x, position.y + 0.05, 0.5]}
            >
              <spriteMaterial attach="material" map={plantTexture2} />
            </sprite>
          )}
          {tileState < 16 && tileState >= 12 && (
            <sprite
              scale={[1, 1, 1]}
              position={[position.x, position.y + 0.1, 0.5]}
            >
              <spriteMaterial attach="material" map={plantTexture3} />
            </sprite>
          )}
          {tileState < 20 && tileState >= 16 && (
            <sprite
              scale={[1, 1, 1]}
              position={[position.x, position.y + 0.1, 0.5]}
            >
              <spriteMaterial attach="material" map={plantTexture4} />
            </sprite>
          )}
          {tileState === 20 && (
            <sprite
              scale={[1, 1, 1]}
              position={[position.x, position.y + 0.1, 0.5]}
            >
              <spriteMaterial attach="material" map={finalTexture} />
            </sprite>
          )}
        </>
      )}
    </>
  );
}
