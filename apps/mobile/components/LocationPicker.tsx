import { introsFetch } from "@/lib/intros-fetch";
import { Country, Province } from "@intros/shared";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Button, Modal, Text, View } from "react-native";

export default function LocationPicker({
  selectedCountryName,
  selectedProvinceName,
  onCountryValueChange,
  onProvinceValueChange,
  onModalClose,
}: {
  selectedCountryName?: string;
  selectedProvinceName?: string;
  onCountryValueChange: (country?: Country) => void;
  onProvinceValueChange: (province?: Province) => void;
  onModalClose: () => void;
}) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    introsFetch("/api/countries").then(({ countries }) => {
      setCountries([emptyLocation].concat(countries));
    });
  }, []);

  const fetchProvinces = async () => {
    const country = countries.find(({ name }) => name === selectedCountryName);
    if (!country) return;

    const res = await introsFetch("/api/countries/[isoCode]", {
      params: { isoCode: country.isoCode },
    });
    if ("errorCode" in res) return;

    setProvinces([emptyLocation].concat(res.provinces));
  };

  useEffect(() => {
    fetchProvinces();
  }, [selectedCountryName, countries]);

  return (
    <Modal>
      <Text>Country</Text>
      <Picker
        selectedValue={selectedCountryName}
        onValueChange={(itemValue) =>
          onCountryValueChange(countries.find((c) => c.name === itemValue))
        }
      >
        {countries.map(({ isoCode, name }) => (
          <Picker.Item key={isoCode} label={name} value={name} />
        ))}
      </Picker>

      <Text>Province</Text>
      <Picker
        selectedValue={selectedProvinceName}
        onValueChange={(itemValue) =>
          onProvinceValueChange(provinces.find((p) => p.name === itemValue))
        }
      >
        {provinces.map(({ isoCode, name }) => (
          <Picker.Item key={isoCode} label={name} value={name} />
        ))}
      </Picker>

      <View>
        <Button title="Close" onPress={onModalClose} />
      </View>
    </Modal>
  );
}

const emptyLocation = { name: "", isoCode: "" };
