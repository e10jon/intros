import { introsFetch } from "@/lib/intros-fetch";
import { useEffect } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { Formik, useFormikContext } from "formik";
import { Body } from "@intros/types";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

const FetchProfile = () => {
  const { setFieldValue } = useFormikContext<Body<"/api/profile">>();

  useEffect(() => {
    introsFetch("/api/profile").then(({ profile }) => {
      setFieldValue("name", profile.name || "");
      setFieldValue("title", profile.title || "");
      setFieldValue("bio", profile.bio || "");
    });
  }, []);

  return null;
};

export default function EditProfile() {
  return (
    <View>
      <SignedIn>
        <Text>Edit Profile</Text>
        <Formik<Body<"/api/profile">>
          initialValues={{ name: "", title: "", bio: "" }}
          onSubmit={async (values) => {
            console.log(values);
            await introsFetch("/api/profile", {
              method: "POST",
              body: values,
            });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <FetchProfile />
              <View>
                <Text>Name</Text>
                <TextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />

                <Text>Title</Text>
                <TextInput
                  onChangeText={handleChange("title")}
                  onBlur={handleBlur("title")}
                  value={values.title}
                />

                <Text>Bio</Text>
                <TextInput
                  onChangeText={handleChange("bio")}
                  onBlur={handleBlur("bio")}
                  value={values.bio}
                  multiline
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
