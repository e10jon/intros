import { introsFetch } from "@/lib/intros-fetch";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { Formik, useFormikContext } from "formik";
import {
  Body,
  DayOfWeek,
  defaultDailyIntrosLimit,
  EmailFrequency,
} from "@intros/types";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";

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

const EmailFrequencyPicker = () => {
  const { setFieldValue, values } = useFormikContext<Body<"/api/settings">>();

  return (
    <>
      <Text>Email Frequency</Text>
      <Picker
        selectedValue={values.emailFrequency}
        onValueChange={(itemValue) =>
          setFieldValue("emailFrequency", itemValue)
        }
      >
        {Object.values(EmailFrequency).map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
    </>
  );
};

const TimeZonePicker = () => {
  const { setFieldValue, values } = useFormikContext<Body<"/api/settings">>();

  const [timeZones, setTimeZones] = useState<string[]>([]);

  useEffect(() => {
    introsFetch("/api/timezones").then(({ timezones }) => {
      setTimeZones(timezones);
    });
  }, []);

  return (
    <>
      <Text>Time Zone</Text>
      <Picker
        selectedValue={values.timeZone}
        onValueChange={(itemValue) => setFieldValue("timeZone", itemValue)}
      >
        {timeZones.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
    </>
  );
};

const SendEmailsDayOfWeekPicker = () => {
  const { setFieldValue, values } = useFormikContext<Body<"/api/settings">>();

  return (
    <>
      <Text>Day of week to receive emails</Text>
      <Picker
        selectedValue={values.sendEmailsDayOfWeek}
        onValueChange={(itemValue) =>
          setFieldValue("sendEmailsDayOfWeek", itemValue)
        }
      >
        {Object.values(DayOfWeek).map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
    </>
  );
};

export default function EditSettings() {
  const updateSettings = async (values: Body<"/api/settings">) => {
    await introsFetch("/api/settings", {
      method: "POST",
      body: values,
    });
  };

  return (
    <ScrollView>
      <SignedIn>
        <Text>Edit Settings</Text>
        <Formik<Body<"/api/settings">>
          initialValues={{}}
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

                <Text>Daily intros limit</Text>
                <TextInput
                  onChangeText={handleChange("dailyIntrosLimit")}
                  onBlur={handleBlur("dailyIntrosLimit")}
                  value={values.dailyIntrosLimit?.toString()}
                  keyboardType="number-pad"
                />

                <TimeZonePicker />

                <EmailFrequencyPicker />

                <SendEmailsDayOfWeekPicker />

                <Button onPress={handleSubmit as any} title="Submit" />
              </View>
            </>
          )}
        </Formik>
      </SignedIn>

      <SignedOut>
        <Text>Need to log in</Text>
      </SignedOut>
    </ScrollView>
  );
}
