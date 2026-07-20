import { useEffect, useState } from "react";

export default function NotificationsTab() {
  const [prefs, setPrefs] = useState(null);
  const [list, setList] = useState([]);

  // Use the project token
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadPreferences();
    loadNotifications();
  }, []);

  const loadPreferences = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/notifications/preferences",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setPrefs({
          order_updates: false,
          offers: false,
          wallet: false,
          email_enabled: false,
          sms_enabled: false,
        });
        return;
      }

      const data = await res.json();
      setPrefs(data);
    } catch (err) {
      console.error("Preferences Error:", err);

      setPrefs({
        order_updates: false,
        offers: false,
        wallet: false,
        email_enabled: false,
        sms_enabled: false,
      });
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setList([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setList(data);
      } else if (Array.isArray(data.notifications)) {
        setList(data.notifications);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Notification Error:", err);
      setList([]);
    }
  };

  const update = async (updated) => {
    setPrefs(updated);

    try {
      await fetch(
        "http://localhost:4000/api/notifications/preferences",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updated),
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!prefs) {
    return <p>Loading preferences...</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Notifications
      </h3>

      <div className="space-y-3 max-w-md">
        {[
          ["order_updates", "Order Updates"],
          ["offers", "Offers & Promotions"],
          ["wallet", "Wallet & Refunds"],
          ["email_enabled", "Email Notifications"],
          ["sms_enabled", "SMS Notifications"],
        ].map(([key, label]) => (
          <label
            key={key}
            className="flex items-center justify-between"
          >
            <span>{label}</span>

            <input
              type="checkbox"
              checked={!!prefs[key]}
              onChange={(e) =>
                update({
                  ...prefs,
                  [key]: e.target.checked,
                })
              }
            />
          </label>
        ))}
      </div>

      <div className="mt-8">
        <h4 className="font-semibold mb-3">
          Recent Notifications
        </h4>

        {list.length === 0 ? (
          <p className="text-gray-500">
            No notifications yet.
          </p>
        ) : (
          <div className="space-y-3">
            {list.map((n) => (
              <div
                key={n.id}
                className="border p-3 rounded"
              >
                <p className="font-medium">
                  {n.title}
                </p>

                <p className="text-sm text-gray-600">
                  {n.message}
                </p>

                <p className="text-xs text-gray-400">
                  {new Date(
                    n.created_at
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}