import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, User, PlusCircle, Search } from "lucide-react";

export default async function QuickJobsPage() {

  const cards = [
    {
      title: "Post Quick Job ",
      description: "Publish a short-term job and hire someone to do it.",
      icon: <PlusCircle className="w-14 h-14 text-blue-500" />,
      link: `/user/quickjobs/create`,
      buttonText: "Create Gig",
    },
    {
      title: "My Profile",
      description: "Offer your skills and services (e.g., Fixing, Tutoring, etc.).",
      icon: <User  className="w-14 h-14 text-green-500" />,
      link: `/user/quickjobs/myprofile`,
      buttonText: "My Profile",
    },
    {
      title: "My Quick Jobs",
      description: "View and manage quick jobs you have posted.",
      icon: <Briefcase className="w-14 h-14 text-purple-500" />,
      link: `/user/quickjobs/listings`,
      buttonText: "View Jobs",
    },
    {
      title: "Find Quick Job",
      description: "Browse gigs posted by other users to hire them.",
      icon: <Search className="w-14 h-14 text-orange-500" />,
      link: `/user/quickjobs/find`,
      buttonText: "Find Gigs",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6 py-12">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl w-full">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            className="flex flex-col justify-between p-8 rounded-2xl shadow-lg hover:shadow-2xl transition min-h-[320px]"
          >
            <CardHeader className="flex flex-col items-center text-center space-y-4">
              {card.icon}
              <CardTitle className="text-2xl font-bold">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow items-center text-center space-y-6">
              <p className="text-gray-600 text-lg">{card.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={card.link} className="w-full">
                <Button className="w-full text-lg py-6">{card.buttonText}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
