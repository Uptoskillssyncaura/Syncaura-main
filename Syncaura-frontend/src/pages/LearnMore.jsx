import React from "react";
import {
  CheckCircle,
  Users,
  Calendar,
  FolderOpen,
  BarChart3,
  ShieldCheck,
  Brain,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
    title: "Task Management",
    desc: "Create, assign, and track tasks efficiently with real-time updates.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    title: "Team Collaboration",
    desc: "Collaborate with your team seamlessly using shared workspaces.",
  },
  {
    icon: <Calendar className="w-8 h-8 text-purple-600" />,
    title: "Meeting Scheduler",
    desc: "Plan meetings, deadlines, and important events with ease.",
  },
  {
    icon: <FolderOpen className="w-8 h-8 text-orange-500" />,
    title: "Document Management",
    desc: "Store, organize, and securely share important project files.",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-pink-600" />,
    title: "Analytics Dashboard",
    desc: "Monitor project progress using insightful charts and reports.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-red-500" />,
    title: "Secure Authentication",
    desc: "Protect user accounts with secure authentication and access control.",
  },
];

const LearnMore = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Learn More About Syncaura
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Syncaura is an intelligent collaboration and project management
            platform that helps teams organize work, communicate efficiently,
            and deliver projects faster.
          </p>
        </div>
      </div>

      {/* About */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          About Syncaura
        </h2>

        <p className="text-gray-600 text-lg leading-8 text-center max-w-4xl mx-auto">
          Syncaura combines project management, communication, scheduling,
          document sharing, analytics, and AI-powered productivity tools into a
          single platform. It eliminates the need for multiple applications and
          enables teams to collaborate more effectively.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Key Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="mb-4">{feature.icon}</div>

              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Syncaura?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="text-center p-8 rounded-xl bg-blue-50">
              <Rocket className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-bold text-xl mb-3">
                Faster Workflow
              </h3>
              <p className="text-gray-600">
                Manage projects efficiently and reduce manual work.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-green-50">
              <ShieldCheck className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="font-bold text-xl mb-3">
                Secure Platform
              </h3>
              <p className="text-gray-600">
                Advanced authentication and secure data management.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-purple-50">
              <Brain className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="font-bold text-xl mb-3">
                AI Powered
              </h3>
              <p className="text-gray-600">
                Intelligent features improve productivity and collaboration.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Workflow */}
      {/* Workflow */}
<section className="py-20 bg-gray-100">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
      How Syncaura Works
    </h2>

    <p className="text-center text-gray-600 mb-14 max-w-3xl mx-auto">
      Syncaura streamlines the entire project lifecycle, from planning to
      successful delivery, helping teams stay organized and productive.
    </p>

    <div className="grid md:grid-cols-5 gap-6">

      {[
        {
          number: "1",
          title: "Create Project",
          desc: "Start a new project workspace and define objectives, timelines, and goals.",
        },
        {
          number: "2",
          title: "Assign Tasks",
          desc: "Allocate tasks to team members with priorities and deadlines.",
        },
        {
          number: "3",
          title: "Collaborate",
          desc: "Share files, communicate, and work together in real time.",
        },
        {
          number: "4",
          title: "Track Progress",
          desc: "Monitor milestones, analytics, and task completion using dashboards.",
        },
        {
          number: "5",
          title: "Complete Project",
          desc: "Review deliverables, finalize work, and successfully close the project.",
        },
      ].map((step, index) => (
        <div
          key={index}
          className="relative bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
            {step.number}
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-3">
            {step.title}
          </h3>

          <p className="text-gray-600 text-sm leading-6">
            {step.desc}
          </p>

          {index !== 4 && (
            <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 text-3xl text-blue-500">
              →
            </div>
          )}
        </div>
      ))}

    </div>

  </div>
</section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white py-20">
        <div className="text-center max-w-4xl mx-auto px-6">

          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience Syncaura?
          </h2>

          <p className="text-lg text-blue-100 mb-8">
            Join thousands of professionals using Syncaura to manage projects,
            improve collaboration, and achieve better productivity.
          </p>

          <button className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition">
            Get Started
          </button>

        </div>
      </section>

    </div>
  );
};

export default LearnMore;