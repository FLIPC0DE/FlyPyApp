import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";

interface GitHubUser {
  name: string;
  login: string;
  avatar_url: string;
  html_url: string;
  bio?: string;
}

interface TeamMemberProps {
  github: string;
  role: string;
}

export function TeamMember({ github, role }: TeamMemberProps) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGitHubUser = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${github}`);
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(`Error fetching GitHub user ${github}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubUser();
  }, [github]);

  if (loading) {
    return (
      <Card>
        <CardBody className="items-center justify-center p-6 min-h-[200px]">
          <Spinner color="primary" />
        </CardBody>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Card>
        <CardBody className="items-center text-center gap-3 p-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-success flex items-center justify-center text-2xl text-white font-bold">
            ?
          </div>
          <div>
            <h3 className="font-semibold text-lg">@{github}</h3>
            <p className="text-sm text-default-500">{role}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card isPressable>
      <CardBody className="items-center text-center gap-3 p-6">
        <Link
          isExternal
          href={user.html_url}
          className="flex flex-col items-center gap-3"
        >
          <img
            src={user.avatar_url}
            alt={user.name || user.login}
            className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary transition-all"
          />
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {user.name || user.login}
            </h3>
            <p className="text-sm text-primary">@{user.login}</p>
            <p className="text-sm text-default-500 mt-1">{role}</p>
            {user.bio && (
              <p className="text-xs text-default-400 mt-2 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
        </Link>
      </CardBody>
    </Card>
  );
}