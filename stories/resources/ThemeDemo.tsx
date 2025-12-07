import { themeNameMap, THEME_NAME } from '../../src/shared/constants';
const darkColors = [
    THEME_NAME.PRIMARY,
    THEME_NAME.INFO,
    THEME_NAME.SUCCESS,
    THEME_NAME.WARNING,
    THEME_NAME.ERROR,
    THEME_NAME.BORDER_COLOR,
    THEME_NAME.TOAST,
    THEME_NAME.TOOLTIP_COLOR,
    THEME_NAME.DISABLED,
    THEME_NAME.TEXT_COLOR_DARK,
];

export default function ThemeDemo() {
    return (
        <table>
            <thead>
                <tr>
                    <th>Variable Name</th>
                    <th>Default Value</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(themeNameMap).map(([key, value]) => (
                    <tr key={key}>
                        <td>
                            <pre>{key}</pre>
                        </td>
                        <td
                            style={{
                                textAlign: 'center',
                                backgroundColor:
                                    value.startsWith('#') || value.startsWith('rgb')
                                        ? value
                                        : undefined,
                                color: darkColors.includes(key as THEME_NAME) ? '#fff' : '#000',
                            }}
                        >
                            {value}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
