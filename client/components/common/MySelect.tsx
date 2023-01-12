import Select, { components } from 'react-select';

export default function MySelect(props: any) {
  return (
    <Select
      {...props}
      menuPortalTarget={document.body}
      menuPosition={'fixed'}
      components={{
        Control: (base) => (
          <>
            <label style={{ fontSize: 14, marginBottom: 6, display: 'block' }}>
              {props.label}
            </label>
            <components.Control {...base} />
          </>
        ),
      }}
      styles={{
        container: (base) => ({
          ...base,
          width: '100%',
        }),
        control: (base) => ({
          ...base,
          background: '#F1F3F5',
          border: 'none',
          borderColor: 'none',
          borderRadius: 12,
          minHeight: 40,
          boxShadow: 'none',
        }),
        menu: (base) => ({
          ...base,
          background: '#fff',
          fontSize: 14,
          borderRadius: 12,
          overflow: 'hidden',
          minWidth: props.minW ? props.minW : 'unset',
        }),
        menuList: (base) => ({
          ...base,
        }),
        valueContainer: (base) => ({
          ...base,
          fontSize: 14,
        }),
        option: (styles: any, { isSelected }: any) => ({
          ...styles,
          display: 'inline-block',
          width: '50%',
          backgroundColor: isSelected ? '#7828C8' : null,
          color: isSelected ? 'white' : null,
          ':hover': {
            backgroundColor: isSelected ? null : '#EADCF8',
            color: isSelected ? null : '#7828C8',
          },
          ':active': {
            backgroundColor: null,
            color: null,
          },
        }),
      }}
    />
  );
}
