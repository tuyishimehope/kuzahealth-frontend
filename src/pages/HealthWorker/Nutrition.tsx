import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Heart,
  MessageCircle,
  Search,
  Send,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { alpha, colors } from "@/theme/colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Types
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  expectedDeliveryDate: string;
  bloodGroup: string;
  maritalStatus: string;
  emergencyContactFullName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  highRisk: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sample Nutrients
const NUTRIENTS = [
  {
    name: "Folic Acid",
    description:
      "Essential for preventing neural tube defects and supporting cell division",
    recommendedIntake: "400-600 mcg/day",
    sources: ["Leafy greens", "Fortified cereals", "Legumes", "Citrus fruits"],
    importance: "Critical",
  },
  {
    name: "Iron",
    description:
      "Prevents anemia and supports increased blood volume during pregnancy",
    recommendedIntake: "27 mg/day",
    sources: ["Red meat", "Spinach", "Beans", "Fortified cereals"],
    importance: "Critical",
  },
  {
    name: "Calcium",
    description:
      "Essential for fetal bone development and maintaining maternal bone health",
    recommendedIntake: "1000-1200 mg/day",
    sources: ["Dairy products", "Dark leafy greens", "Fortified foods"],
    importance: "High",
  },
  {
    name: "Vitamin D",
    description: "Supports calcium absorption and immune system function",
    recommendedIntake: "600-800 IU/day",
    sources: ["Fortified milk", "Fatty fish", "Egg yolks", "Sunlight"],
    importance: "High",
  },
];

// Preset Messages
const PRESET_MESSAGES = [
  "Ibuka gufata folike acid yawe uyu munsi.",
  "Fungura ibiribwa bikungahaye kuri feri (nk'ibishyimbo, imboga zitukura).",
  "Fata amata cyangwa ibindi bifite kalisiyumu buri munsi.",
  "Nywa amazi ahagije kandi unywe vitamini zawe.",
];

// Fetch patients
const fetchPatients = async () => {
  const { data } = await axiosInstance.get("/api/parents");
  return data as Patient[];
};

// Components
const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: React.ReactNode;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-card rounded-2xl shadow-soft p-6 border border-border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-neutral-600">{title}</p>
        <p className="text-3xl font-bold text-neutral-900">{value}</p>
        <p className="text-sm text-success-600 flex items-center mt-1">
          {subtitle}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
  </div>
);

const NutrientCard = ({ nutrient }: { nutrient: (typeof NUTRIENTS)[0] }) => (
  <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-neutral-900">{nutrient.name}</h3>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          nutrient.importance === "Critical"
            ? "bg-danger-100 text-danger-800"
            : "bg-warning-100 text-warning-800"
        }`}
      >
        {nutrient.importance}
      </span>
    </div>
    <p className="text-sm text-neutral-600 mb-3">{nutrient.description}</p>
    <div className="space-y-2 text-sm">
      <div>
        <span className="font-medium text-neutral-700">Daily Intake:</span>
        <span className="ml-2 text-primary-600 font-semibold">
          {nutrient.recommendedIntake}
        </span>
      </div>
      <div>
        <span className="font-medium text-neutral-700">Sources:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {nutrient.sources.map((source, idx) => (
            <span
              key={idx}
              className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs"
            >
              {source}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const QuickActionButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button className="w-full text-left p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors flex items-center space-x-3">
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// Main Dashboard
const MaternalNutritionDashboard = () => {
  const [selectedMother, setSelectedMother] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: mothers = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });
  console.log(isLoading);

  const filteredNutrients = NUTRIENTS.filter((n) =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!selectedMother || !message) return;

    const mother = mothers.find((m) => m.id === selectedMother);
    if (!mother) return;

    try {
      const response = await axiosInstance.post("/api/nutrition-info", {
        phoneNumber: mother.phone,
        message,
        senderEmail: "healthworker@example.com", // Replace with actual sender email if needed
      });
      console.log(response);

      alert(
        `Message sent to ${mother.firstName} (${mother.phone}): ${message}`
      );
      setMessage(""); // reset message
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { padding: 20, font: { size: 12 } },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(0,0,0,0.1)" } },
    },
  };
  const {t} = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-info-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  {t("nutritionCenter")}
                </h1>
                <p className="text-sm text-neutral-600">{t("healthWorkerDashboard")}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Patients"
            value={mothers.length}
            subtitle={
              <>
                <TrendingUp className="h-4 w-4 mr-1" /> +12% from last month
              </>
            }
            icon={<Users className="h-6 w-6 text-info-600" />}
            color="bg-info-100"
          />
          <StatsCard
            title="High Risk Cases"
            value={8}
            subtitle={
              <>
                <AlertCircle className="h-4 w-4 mr-1" /> Needs attention
              </>
            }
            icon={<AlertCircle className="h-6 w-6 text-warning-600" />}
            color="bg-warning-100"
          />
          <StatsCard
            title="Messages Sent"
            value={1247}
            subtitle={
              <>
                <CheckCircle className="h-4 w-4 mr-1" /> 94% delivery rate
              </>
            }
            icon={<MessageCircle className="h-6 w-6 text-success-600" />}
            color="bg-success-100"
          />
          <StatsCard
            title="Avg Compliance"
            value="89%"
            subtitle={
              <>
                <Activity className="h-4 w-4 mr-1" /> Above target
              </>
            }
            icon={<Activity className="h-6 w-6 text-primary-600" />}
            color="bg-primary-100"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Patient Messaging */}
            <div className="bg-card rounded-2xl shadow-soft p-6 border border-border">
              <div className="flex items-center space-x-2 mb-6">
                <Stethoscope className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-neutral-900">
                  {t("patientCommunication")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="field-label">
                    {t("selectPatient")}
                  </label>
                  <select
                    value={selectedMother}
                    onChange={(e) => setSelectedMother(e.target.value)}
                    className="field w-full"
                  >
                    <option value="">{t("choosePatient")}</option>
                    {mothers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} - {m.bloodGroup}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMother && (
                  <div className="space-y-4">
                    <div>
                      <label className="field-label">
                        {t("quickMessage")}
                      </label>
                      <select
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="field w-full"
                      >
                        <option value="">Select a message...</option>
                        {PRESET_MESSAGES.map((msg, idx) => (
                          <option key={idx} value={msg}>
                            {msg}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!selectedMother || !message}
                      className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        selectedMother && message
                          ? "bg-primary-600 text-white hover:bg-primary-700"
                          : "bg-neutral-300 text-neutral-600 cursor-not-allowed"
                      }`}
                    >
                      <Send className="h-4 w-4" />
                      <span>{t("sendMessage")}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Nutritional Guidelines */}
            <div className="bg-card rounded-2xl shadow-soft p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {t("nutritionalGuidelines")}
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search nutrients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="field pl-10 pr-4"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNutrients.map((nutrient, idx) => (
                  <NutrientCard key={idx} nutrient={nutrient} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Analytics & Actions */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-soft p-6 border border-border">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                {t("riskDistribution")}
              </h3>
              <div className="h-48">
                <Doughnut
                  data={{
                    labels: ["Low", "Medium", "High"],
                    datasets: [
                      {
                        data: [65, 25, 10],
                        backgroundColor: [colors.success[500], colors.warning[500], colors.danger[500]],
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-soft p-6 border border-border">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                {t("complianceTrends")}
              </h3>
              <div className="h-48">
                <Line
                  data={{
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                    datasets: [
                      {
                        label: "Supplement Compliance (%)",
                        data: [85, 92, 88, 95],
                        borderColor: colors.primary[600],
                        backgroundColor: alpha("primary-600", 0.1),
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-soft p-6 border border-border">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                {t('quickActions')}
              </h3>
              <QuickActionButton
                icon={<Calendar className="h-5 w-5 text-primary-600" />}
                label={t("scheduleFollowUp")}
              />
              <QuickActionButton
                icon={<AlertCircle className="h-5 w-5 text-warning-600" />}
                label={t("flagHighRisk")}
              />
              {/* <QuickActionButton
                icon={<MessageCircle className="h-5 w-5 text-success-600" />}
                label="Bulk Messaging"
              /> */}
            </div>
          </div>
        </div>

        {/* Nutrition Chart */}
        <div className="mt-8 bg-card rounded-2xl shadow-soft p-6 border border-border">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            {t("scheduleFollowUp")}
          </h3>
          <div className="h-80">
            <Bar
              data={{
                labels: [
                  "Folic Acid",
                  "Iron",
                  "Calcium",
                  "Vitamin D",
                  "Omega-3",
                ],
                datasets: [
                  {
                    label: "Recommended (mg/day)",
                    data: [0.4, 27, 1000, 0.015, 0.3],
                    backgroundColor: colors.chart.slice(0, 5),
                    borderWidth: 0,
                    borderRadius: 8,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaternalNutritionDashboard;
