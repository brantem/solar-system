import { useEffect } from 'react';
import { useLoaderData, useParams, useRouteLoaderData } from 'react-router-dom';

import type { Planet, SolarSystem } from '../types';

export const useFiles = () => {
  const params = useParams() as { solarSystem: string };
  return {
    buildKey(key: string) {
      let k = key;
      if (k.startsWith('/')) k = k.slice(1);
      if (!k.startsWith(params.solarSystem)) k = `${params.solarSystem}/${k.replace(/^\//, '')}`;
      return k;
    },
  };
};

export const useSolarSystem = () => {
  return useRouteLoaderData('solarSystem') as SolarSystem;
};

export const useNavigation = () => {
  const params = useParams() as { solarSystem: string; planet: string };

  const solarSystem = useSolarSystem();
  const index = solarSystem.planets.findIndex((planet) => planet.id === params.planet);

  return {
    prevId: solarSystem.planets[index - 1]?.id || null,
    nextId: solarSystem.planets[index + 1]?.id || null,
  };
};

export const usePlanet = <P extends Planet>(): P => {
  const planet = useLoaderData() as P;

  const solarSystem = useSolarSystem();

  useEffect(() => {
    document.title = `${planet.title} - ${solarSystem.title}`;
  }, [solarSystem, planet]);

  return planet;
};
