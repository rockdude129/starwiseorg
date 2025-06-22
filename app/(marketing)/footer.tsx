import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <div className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly">
        <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/planets.svg"
            alt="Planets"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Planets
        </Button>

        <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/stars.svg"
            alt="Stars"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Stars
        </Button>

        <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/galaxies.svg"
            alt="Galaxies"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Galaxies
        </Button>

        <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/telescopes.svg"
            alt="Telescopes"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Telescopes
        </Button>

        <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/missions.svg"
            alt="Space Missions"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Space Missions
        </Button>
      </div>
    </div>
  );
};
