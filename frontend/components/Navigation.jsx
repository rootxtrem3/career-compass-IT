import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

export default function Navigation() {
  const router = useRouter();

  const isActive = (path) => (router.pathname === path ? "nav-btn active" : "nav-btn");

  return (
    <nav className="top-nav glass-soft">
      <Button
        component={Link}
        href="/"
        size="small"
        startIcon={<HomeRoundedIcon />}
        className={isActive("/")}
      >
        Home
      </Button>
      <Button
        component={Link}
        href="/analysis"
        size="small"
        startIcon={<InsightsRoundedIcon />}
        className={isActive("/analysis")}
      >
        Analysis
      </Button>
      <Button
        component={Link}
        href="/paths"
        size="small"
        startIcon={<MapRoundedIcon />}
        className={isActive("/paths")}
      >
        Paths
      </Button>
      <Button
        component={Link}
        href="/about"
        size="small"
        startIcon={<InfoRoundedIcon />}
        className={isActive("/about")}
      >
        About
      </Button>
      <Button
        component={Link}
        href="/profile"
        size="small"
        startIcon={<AccountCircleRoundedIcon />}
        className={isActive("/profile")}
      >
        Profile
      </Button>
    </nav>
  );
}
