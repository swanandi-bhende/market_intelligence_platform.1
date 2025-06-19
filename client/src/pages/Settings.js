import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, Label, Select } from '../components/Common';

const SettingsContainer = styled.div`
  padding: 20px;
`;

const SettingsSection = styled(Card)`
  margin-bottom: 20px;
  padding: 20px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 15px;
  color: ${({ theme }) => theme.primary};
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.85rem;
  margin-top: 5px;
`;

function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'My Business',
    defaultCurrency: 'USD',
    notificationEmail: 'admin@mybusiness.com',
    dataRefresh: 24,
    theme: 'light',
  });

  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [formEditing, setFormEditing] = useState(false);
  const [apiEditing, setApiEditing] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: null }));

    if (name === 'dataRefresh') {
      const numVal = Number(value);
      if (numVal < 1 || numVal > 168) {
        setErrors((prev) => ({ ...prev, dataRefresh: 'Must be between 1 and 168 hours' }));
      }
      setSettings((prev) => ({ ...prev, [name]: numVal }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateEmail = (email) => {
    // Simple email regex
    return /\S+@\S+\.\S+/.test(email);
  };

  const saveSettings = () => {
    const newErrors = {};

    if (!settings.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!validateEmail(settings.notificationEmail)) newErrors.notificationEmail = 'Invalid email address';
    if (settings.dataRefresh < 1 || settings.dataRefresh > 168)
      newErrors.dataRefresh = 'Must be between 1 and 168 hours';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate save to backend
    console.log('Settings saved:', settings, 'API Key:', apiKey);

    setFormEditing(false);
    setApiEditing(false);
  };

  return (
    <SettingsContainer>
      <h1>Settings</h1>

      <SettingsSection>
        <SectionTitle>Company Information</SectionTitle>

        <Label>
          Company Name
          <Input
            type="text"
            name="companyName"
            value={settings.companyName}
            onChange={handleChange}
            disabled={!formEditing}
          />
          {errors.companyName && <ErrorText>{errors.companyName}</ErrorText>}
        </Label>

        <Label>
          Default Currency
          <Select
            name="defaultCurrency"
            value={settings.defaultCurrency}
            onChange={handleChange}
            disabled={!formEditing}
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="INR">Indian Rupee (INR)</option>
          </Select>
        </Label>

        <Label>
          Notification Email
          <Input
            type="email"
            name="notificationEmail"
            value={settings.notificationEmail}
            onChange={handleChange}
            disabled={!formEditing}
          />
          {errors.notificationEmail && <ErrorText>{errors.notificationEmail}</ErrorText>}
        </Label>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>Application Settings</SectionTitle>

        <Label>
          Theme
          <Select name="theme" value={settings.theme} onChange={handleChange} disabled={!formEditing}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </Select>
        </Label>

        <Label>
          Data Refresh Frequency (hours)
          <Input
            type="number"
            name="dataRefresh"
            value={settings.dataRefresh}
            onChange={handleChange}
            min="1"
            max="168"
            disabled={!formEditing}
          />
          {errors.dataRefresh && <ErrorText>{errors.dataRefresh}</ErrorText>}
        </Label>
      </SettingsSection>

      <SettingsSection>
        <SectionTitle>API Integration</SectionTitle>

        <Label>
          API Key
          <div style={{ display: 'flex', gap: '10px' }}>
            <Input
              type={apiEditing ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={!apiEditing}
              style={{ flex: 1 }}
            />
            <Button small onClick={() => setApiEditing((prev) => !prev)}>
              {apiEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </Label>
      </SettingsSection>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {formEditing ? (
          <>
            <Button primary onClick={saveSettings}>
              Save Changes
            </Button>
            <Button
              onClick={() => {
                setFormEditing(false);
                setErrors({});
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button primary onClick={() => setFormEditing(true)}>
            Edit Settings
          </Button>
        )}
      </div>
    </SettingsContainer>
  );
}

export default Settings;
