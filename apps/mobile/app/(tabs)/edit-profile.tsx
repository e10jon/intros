import { introsFetch } from "@/lib/intros-fetch";
import { useEffect } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { Formik, useFormikContext } from "formik";
import { Body } from "@intros/types";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";

const FetchProfile = () => {
  const { user } = useUser();
  const { setFieldValue } = useFormikContext<Body<"/api/profile">>();

  useEffect(() => {
    introsFetch("/api/profile").then(({ profile }) => {
      setFieldValue("name", profile.name || "");
      setFieldValue("title", profile.title || "");
      setFieldValue("bio", profile.bio || "");
      setFieldValue("province", profile.province || "");
      setFieldValue("country", profile.country || "");
    });
  }, [user]);

  return null;
};

export default function EditProfile() {
  const updateBio = async (values: Body<"/api/profile">) => {
    await introsFetch("/api/profile", {
      method: "POST",
      body: values,
    });
  };

  return (
    <View>
      <SignedIn>
        <Text>Edit Profile</Text>
        <Formik<Body<"/api/profile">>
          initialValues={{ name: "", title: "", bio: "" }}
          onSubmit={updateBio}
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

                <Text>Country</Text>
                <TextInput
                  onChangeText={handleChange("country")}
                  onBlur={handleBlur("country")}
                  value={values.country}
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
