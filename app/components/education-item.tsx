import Image from "next/image";
import type { FC } from "react";

interface EducationItemProps {
  edu: {
    institution: string;
    logo?: string;
    degree: string;
    period: string;
    location: string;
    website?: string;
  };
}

const EducationItem: FC<EducationItemProps> = ({ edu }) => {
  return (
    <div>
      <h3 className="font-medium text-xl mb-1 tracking-tighter flex items-center">
        {edu.logo && (
          <Image
            src={edu.logo}
            alt={edu.institution}
            width={20}
            height={20}
            className="mr-4"
          />
        )}
        {edu.website ? (
          <a
            href={edu.website}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 hover:underline"
          >
            {edu.institution}
          </a>
        ) : (
          <span className={edu.logo ? "ml-2" : ""}>{edu.institution}</span>
        )}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
        {edu.degree} | {edu.period} | {edu.location}
      </p>
    </div>
  );
};

export default EducationItem;
