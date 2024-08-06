import { introsFetch } from "@/lib/intros-fetch";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { Formik, useFormikContext } from "formik";
import { Body, Country, Province } from "@intros/shared";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Picker } from "@react-native-picker/picker";

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

const LocationPicker = () => {
  const { setFieldValue, values } = useFormikContext<Body<"/api/profile">>();

  const [countries, setCountries] = useState<Country[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    introsFetch("/api/countries").then(({ countries }) => {
      setCountries(countries);
      if (!values.country) setFieldValue("country", countries[0].name);
    });
  }, []);

  const fetchProvinces = async () => {
    const selectedCountryName = values.country;
    if (!selectedCountryName) return;
    const country = countries.find(({ name }) => name === selectedCountryName);
    if (!country) return;

    const res = await introsFetch("/api/countries/[isoCode]", {
      params: { isoCode: country.isoCode },
    });
    if ("errorCode" in res) return;

    setProvinces(res.provinces);
  };

  useEffect(() => {
    fetchProvinces();
  }, [values.country]);

  return (
    <>
      <Text>Country</Text>
      <Picker
        selectedValue={values.country}
        onValueChange={(itemValue) => setFieldValue("country", itemValue)}
      >
        {countries.map(({ isoCode, name }) => (
          <Picker.Item key={isoCode} label={name} value={name} />
        ))}
      </Picker>

      <Text>Province</Text>
      <Picker
        selectedValue={values.province}
        onValueChange={(itemValue) => setFieldValue("province", itemValue)}
      >
        {provinces.map(({ isoCode, name }) => (
          <Picker.Item key={isoCode} label={name} value={name} />
        ))}
      </Picker>
    </>
  );
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

                <LocationPicker />

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
