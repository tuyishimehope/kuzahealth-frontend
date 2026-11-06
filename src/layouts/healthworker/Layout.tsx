import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  Baby,
  CalendarDays,
  CalendarPlus,
  LayoutDashboard,
  Salad,
  Syringe,
  UserCog,
  UserPlus,
  UsersRound,
} from "lucide-react";
import AppShell, { type NavSection } from "@/components/shell/AppShell";

const HealthWorkerLayout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Authentication check
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/auth/signin");
  }, [navigate]);

  const sections = useMemo<NavSection[]>(
    () => [
      {
        items: [
          { label: t("menu.dashboard"), href: "/healthworker/dashboard", icon: LayoutDashboard },
          { label: t("menu.analytics"), href: "/healthworker/analytics", icon: BarChart3 },
        ],
      },
      {
        title: t("sidebar.mother-information"),
        items: [
          { label: t("menu.addMother"), href: "/healthworker/patient", icon: UserPlus },
          { label: t("menu.viewMothers"), href: "/healthworker/view-patient", icon: UsersRound },
          { label: t("menu.nutritionInfo"), href: "/healthworker/nutrition", icon: Salad },
        ],
      },
      {
        title: t("sidebar.infant-information"),
        items: [
          { label: t("menu.addInfant"), href: "/healthworker/add-infant", icon: Baby },
          { label: t("menu.viewInfants"), href: "/healthworker/view-infants", icon: UsersRound },
          { label: t("menu.vaccinations"), href: "/healthworker/infant-vaccination", icon: Syringe },
        ],
      },
      {
        title: t("sidebar.schedules"),
        items: [
          { label: t("menu.addSchedule"), href: "/healthworker/schedule", icon: CalendarPlus },
          { label: t("menu.viewSchedules"), href: "/healthworker/view-schedule", icon: CalendarDays },
        ],
      },
      {
        title: t("sidebar.settings"),
        items: [{ label: t("menu.updateProfile"), href: "/healthworker/profile", icon: UserCog }],
      },
    ],
    [t]
  );

  return <AppShell portal="Health worker" sections={sections} />;
};

export default HealthWorkerLayout;
