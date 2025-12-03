import { Button } from "@heroui/button";
import { GoogleIcon, MicrosoftIcon, GithubIcon } from "@/assets/icons";

type Provider = "google" | "microsoft" | "github";

const providers: { name: string; icon: JSX.Element; key: Provider }[] = [
  { name: "Google", icon: <GoogleIcon className="w-5 h-5" />, key: "google" },
  { name: "Microsoft", icon: <MicrosoftIcon className="w-5 h-5" />, key: "microsoft" },
  { name: "GitHub", icon: <GithubIcon className="w-5 h-5" />, key: "github" },
];

interface ClientesLoginProps {
  onLogin: (provider: Provider) => void;
}

export const ClientesLogin = ({ onLogin }: ClientesLoginProps) => (
  <div className="flex flex-col gap-2 md:flex-row md:justify-center md:gap-4">
    {providers.map(({ name, icon, key }) => (
      <Button
        key={key}
        onClick={() => onLogin(key)}
        color="default"
        variant="bordered"
        className="w-full md:w-12 md:h-12 md:rounded-full md:p-0 md:justify-center"
        startContent={icon}
      >
        <span className="md:hidden">{name}</span>
      </Button>
    ))}
  </div>
);
