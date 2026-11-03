import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TimelineItem from "./TimelineItem";
import { useTranslation } from "react-i18next";
import api from "../../../config/axios";

const isUUID = (str) =>
  typeof str === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

const Timeline = ({ docId, document, onViewVersion, onRestoreVersion }) => {
  const { t } = useTranslation();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVersions = () => {
    if (!docId) return;

    if (!isUUID(docId)) {
      // Local/optimistic document fallback
      if (Array.isArray(document?.versions) && document.versions.length > 0) {
        setVersions(
          document.versions.map((v, idx) => ({
            version: v.version || `v${document.versions.length - idx}.0`,
            status: idx === 0 ? "current" : "archived",
            date: new Date(v.date || document.updated_at || Date.now()).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            editor: document?.creator_name || "Admin",
            title: document?.title || "Document Update",
            content: document?.content || "",
            current: idx === 0,
          }))
        );
      } else {
        setVersions([
          {
            version: "v1.0",
            status: "current",
            date: new Date(document?.created_at || Date.now()).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            editor: document?.creator_name || "Admin",
            title: document?.title || "Initial Creation",
            content: document?.content || "",
            current: true,
          },
        ]);
      }
      return;
    }

    setLoading(true);
    api.get(`/documents/${docId}/versions`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) {
          const mapped = data.map((v, idx) => ({
            id: v.id,
            version: v.version_number || `v${data.length - idx}.0`,
            status: idx === 0 ? "current" : "archived",
            date: new Date(v.edited_at || v.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            editor: v.editor_name || v.edited_by_name || "Admin",
            title: v.title || v.content?.slice(0, 40) || document?.title || "Version Update",
            content: v.content,
            current: idx === 0,
          }));
          setVersions(mapped);
        } else {
          setVersions([
            {
              version: "v1.0",
              status: "current",
              date: new Date(document?.created_at || Date.now()).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
              editor: document?.creator_name || "Admin",
              title: document?.title || "Initial Creation",
              content: document?.content || "",
              current: true,
            }
          ]);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch versions:", err);
        setVersions([
          {
            version: "v1.0",
            status: "current",
            date: new Date(document?.created_at || Date.now()).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            editor: document?.creator_name || "Admin",
            title: document?.title || "Initial Creation",
            content: document?.content || "",
            current: true,
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVersions();
  }, [docId, document]);

  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const lineProgress = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.scrollHeight);
    }
    const controls = animate(lineProgress, height, {
      duration: 2,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [height, versions]);

  if (loading) {
    return <p className="text-center text-gray-400 py-6 text-sm">Loading version history...</p>;
  }

  return (
    <div ref={containerRef} className="relative max-w-xl mx-auto py-6">
      {/* Vertical Line */}
      <div className="absolute left-6 top-0 h-full w-[2px] bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="absolute top-0 left-0 w-full bg-green-500"
          style={{ height: lineProgress }}
        />
      </div>

      <div className="space-y-8">
        {versions.map((item, index) => (
          <TimelineItem
            key={index}
            item={item}
            index={index}
            lineProgress={lineProgress}
            onView={() => onViewVersion?.(item)}
            onRestore={() => onRestoreVersion?.(item, fetchVersions)}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
