import { introsFetch } from "@/lib/intros-fetch";
import { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Formik, useFormikContext } from "formik";
import { Body, DayOfWeek, EmailFrequency } from "@intros/types";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const FetchSettings = () => {
  const { user } = useUser();
  const { setFieldValue } = useFormikContext<Body<"/api/settings">>();

  useEffect(() => {
    introsFetch("/api/settings").then(({ settings }) => {
      setFieldValue("pushToken", settings.pushToken || "");
      setFieldValue("emailFrequency", settings.emailFrequency || "");
      setFieldValue("sendEmailsTime", new Date(settings.sendEmailsTime || ""));
      setFieldValue("sendEmailsDayOfWeek", settings.sendEmailsDayOfWeek || "");
      setFieldValue("dailyIntrosLimit", settings.dailyIntrosLimit || "");
      setFieldValue(
        "dailyIntrosResetTime",
        new Date(settings.dailyIntrosResetTime || "")
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

const SendEmailsTimePicker = () => {
  const { setFieldValue, values } = useFormikContext<Body<"/api/settings">>();

  return (
    <>
      <Text>Send Emails At</Text>
      <DateTimePicker
        mode="time"
        value={values.sendEmailsTime || new Date()}
        onChange={(event) => {
          setFieldValue(
            "sendEmailsTime",
            new Date(event.nativeEvent.timestamp)
          );
        }}
      />
    </>
  );
};

const DailyIntrosResetAtPicker = () => {
  const { setFieldValue, values } = useFormikContext<Body<"/api/settings">>();

  return (
    <>
      <Text>Daily Intros Reset At</Text>
      <DateTimePicker
        mode="time"
        value={values.dailyIntrosResetTime || new Date()}
        onChange={(event) => {
          setFieldValue(
            "dailyIntrosResetTime",
            new Date(event.nativeEvent.timestamp)
          );
        }}
      />
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
        <View>
          <Text>Edit Settings</Text>
        </View>

        <Formik<Body<"/api/settings">>
          initialValues={{}}
          onSubmit={updateSettings}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <FetchSettings />

              <View>
                <ScrollView>
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
                  <SendEmailsTimePicker />
                  <DailyIntrosResetAtPicker />
                  <EmailFrequencyPicker />
                  <SendEmailsDayOfWeekPicker />
                </ScrollView>

                <View>
                  <Button onPress={handleSubmit as any} title="Submit" />
                </View>
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
