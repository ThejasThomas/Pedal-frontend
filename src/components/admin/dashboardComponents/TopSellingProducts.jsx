import { Card, CardHeader } from "@material-tailwind/react";
import { CardContent, CardTitle } from "../../UI/card";

export const TopSellingItems = ({ title, items = [] }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{item.name}</span>
                <span className="font-bold">{item.sales}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };
  