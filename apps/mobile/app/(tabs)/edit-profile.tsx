import { pull, pullAt } from "lodash";
import { introsFetch } from "@/lib/intros-fetch";
import { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Formik, useFormikContext } from "formik";
import { Body, Country, Province } from "@intros/shared";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";
import LocationPicker from "@/components/LocationPicker";

const FetchProfile = () => {
  const { user } = useUser();
  const { setFieldValue } = useFormikContext<Body<"/api/profile">>();

  useEffect(() => {
    introsFetch("/api/profile").then(({ profile }) => {
      setFieldValue("name", profile.name || "");
      setFieldValue("title", profile.title || "");
      setFieldValue("bio", profile.bio || "");
      setFieldValue("interests", profile.interests || []);
      setFieldValue("province", profile.province || "");
      setFieldValue("country", profile.country || "");
    });
  }, [user]);

  return null;
};

const Interests = () => {
  const { values, setFieldValue } = useFormikContext<Body<"/api/profile">>();

  const [newInterest, setNewInterest] = useState("");

  const handleRemovePress = (idx: number) => () => {
    if (!values.interests) return;
    const interestsCopy = values.interests.slice();
    pullAt(interestsCopy, idx);
    setFieldValue("interests", interestsCopy);
  };

  return (
    <>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {values.interests?.map((interest, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={handleRemovePress(idx)}
            style={{ marginHorizontal: 4 }}
          >
            <Text>{interest}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        value={newInterest}
        onChangeText={setNewInterest}
        placeholder="Add Interest"
        onSubmitEditing={() => {
          if (!newInterest) return;
          setFieldValue("interests", [
            ...(values.interests || []),
            newInterest,
          ]);
          setNewInterest("");
        }}
      />
    </>
  );
};

export default function EditProfile() {
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const updateBio = async (values: Body<"/api/profile">) => {
    await introsFetch("/api/profile", {
      method: "POST",
      body: values,
    });
  };

  return (
    <View>
      <SignedIn>
        <ScrollView>
          <Text>Edit Profile</Text>
          <Formik<Body<"/api/profile">> initialValues={{}} onSubmit={updateBio}>
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

                  <Text>Interests</Text>
                  <Interests />

                  <Text>
                    Location: {values.country}, {values.province}
                  </Text>
                  <Button
                    onPress={() => setIsLocationPickerOpen(true)}
                    title="Change Location"
                  />
                  {isLocationPickerOpen && (
                    <LocationPicker
                      selectedCountryName={values.country}
                      selectedProvinceName={values.province}
                      onCountryValueChange={(country) =>
                        handleChange("country")(country?.name || "")
                      }
                      onProvinceValueChange={(province) =>
                        handleChange("province")(province?.name || "")
                      }
                      onModalClose={() => setIsLocationPickerOpen(false)}
                    />
                  )}

                  <Button onPress={handleSubmit as any} title="Submit" />
                </View>
              </>
            )}
          </Formik>
        </ScrollView>
      </SignedIn>

      <SignedOut>
        <Text>Need to log in</Text>
      </SignedOut>
    </View>
  );
}
