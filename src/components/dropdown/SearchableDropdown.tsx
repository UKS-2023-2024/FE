import Select from "react-select";

interface Props {
  options: any;
  handleChangeOptions: (value: string) => void;
  handleSelect: (values: any[]) => void;
}

export const SearchableDropdown = ({
  options,
  handleChangeOptions,
  handleSelect,
}: Props) => {
  const handleInputChange = (value: string) => {
    handleChangeOptions(value);
  };

  const handleOnChange = (values: any[]) => {
    handleSelect(values);
  };

  return (
    <Select
      isMulti={true}
      options={options}
      onInputChange={(e) => handleInputChange(e)}
      onChange={(e) => handleOnChange(e)}
    />
  );
};
