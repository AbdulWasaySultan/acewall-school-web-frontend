import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AspectRatio } from "../components/ui/aspect-ratio";

const LandingPageCard = ({ name, description, imageUrl, buttonUrl }) => {
  return (
    <Card
      className="h-full w-full overflow-hidden cursor-pointer"
      role="region"
      aria-labelledby={`${name}-title`}
    >
      {/* Image with Aspect Ratio */}
      <AspectRatio ratio={16 / 9}>
        <img
          src={imageUrl}
          alt={`Illustration for ${name}`} // descriptive alt text
          className="object-cover w-full h-full"
        />
      </AspectRatio>

      {/* Card Header */}
      <CardHeader>
        <CardTitle id={`${name}-title`} className="text-lg font-bold">
          {name}
        </CardTitle>
      </CardHeader>

      {/* Card Content */}
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>

          {/* Accessible Learn More Button */}
          <a
            href={buttonUrl}
            className="inline-flex items-center w-full justify-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            aria-label={`Learn more about ${name}`}
          >
            Learn more
            <svg
              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandingPageCard;
