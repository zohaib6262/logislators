import { TokenContext } from "@/store/TokenContextProvider";
import { newLightnerColor } from "@/utils/colorUtils";
import { Switch } from "@headlessui/react";
import React, { useContext } from "react";

const EnableSwitch = ({ settings, onChange }) => {
  const { primaryColor } = useContext(TokenContext);

  const lighterPrimary = newLightnerColor(primaryColor, 30);
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <label
            htmlFor="enableAboutus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enable About Us Page
          </label>
          <p className="text-xs text-gray-500">
            Toggle to show/hide the About Us page
          </p>
        </div>
        <Switch
          checked={settings?.enableAboutus || false}
          onChange={(checked) => {
            // Create a synthetic event to match our handleChange pattern
            const syntheticEvent = {
              target: {
                name: "enableAboutus",
                value: checked,
              },
            };
            onChange(syntheticEvent);
          }}
          style={{ backgroundColor: settings?.enableAboutus && primaryColor }}
          className={`${
            !settings?.enableAboutus && "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              settings?.enableAboutus ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label
            htmlFor="enableResources"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enable Resources Page
          </label>
          <p className="text-xs text-gray-500">
            Toggle to show/hide the Resources page
          </p>
        </div>
        <Switch
          checked={settings?.enableResources || false}
          onChange={(checked) => {
            const syntheticEvent = {
              target: {
                name: "enableResources",
                value: checked,
              },
            };
            onChange(syntheticEvent);
          }}
          className={`${
            settings?.enableResources ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              settings?.enableResources ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </>
  );
};

export default EnableSwitch;
