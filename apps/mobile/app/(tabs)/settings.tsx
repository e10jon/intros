import { introsFetch } from "@/lib/intros-fetch";
import { useEffect } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { Formik, useFormikContext } from "formik";
import {
  Body,
  DayOfWeek,
  defaultDailyIntrosLimit,
  EmailFrequency,
} from "@intros/types";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";

const FetchSettings = () => {
  const { user } = useUser();
  const { setFieldValue } = useFormikContext<Body<"/api/settings">>();

  useEffect(() => {
    introsFetch("/api/settings").then(({ settings }) => {
      setFieldValue("pushToken", settings.pushToken || "");
      setFieldValue("emailFrequency", settings.emailFrequency || "");
      setFieldValue("sendEmailsTime", settings.sendEmailsTime || "");
      setFieldValue("sendEmailsDayOfWeek", settings.sendEmailsDayOfWeek || "");
      setFieldValue("dailyIntrosLimit", settings.dailyIntrosLimit || "");
      setFieldValue(
        "dailyIntrosResetTime",
        settings.dailyIntrosResetTime || ""
      );
      setFieldValue("timeZone", settings.timeZone || "");
    });
  }, [user]);

  return null;
};

export default function EditSettings() {
  const updateSettings = async (values: Body<"/api/settings">) => {
    await introsFetch("/api/settings", {
      method: "POST",
      body: values,
    });
  };

  return (
    <View>
      <SignedIn>
        <Text>Edit Settings</Text>
        <Formik<Body<"/api/settings">>
          initialValues={{
            pushToken: "",
            emailFrequency: EmailFrequency.Weekly,
            sendEmailsTime: new Date("12:00"),
            sendEmailsDayOfWeek: DayOfWeek.Saturday,
            dailyIntrosLimit: defaultDailyIntrosLimit,
            dailyIntrosResetTime: new Date("12:00"),
            timeZone: "America/New_York",
          }}
          onSubmit={updateSettings}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <FetchSettings />
              <View>
                <Text>Push Token</Text>
                <TextInput
                  onChangeText={handleChange("pushToken")}
                  onBlur={handleBlur("pushToken")}
                  value={values.pushToken}
                />

                <Text>Email Frequency</Text>
                <TextInput
                  onChangeText={handleChange("emailFrequency")}
                  onBlur={handleBlur("emailFrequency")}
                  value={values.emailFrequency}
                />

                <Button onPress={handleSubmit as any} title="Submit" />
              </View>
            </>
          )}
        </Formik>
      </SignedIn>

      <SignedOut>
        <Text>Need to log in</Text>
      </SignedOut>
    </View>
  );
}
