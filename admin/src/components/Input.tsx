import React, { useState } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';
import { TextInput } from '@strapi/design-system';
import { Button } from '@strapi/design-system';
import { Box } from '@strapi/design-system';
import { Typography } from '@strapi/design-system';
import { Flex } from '@strapi/design-system';
import { Link } from '@strapi/design-system';

interface OgLinkComponentProps {
  name: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  value: string | null;
  intlLabel: { defaultMessage: string };
  attribute: object;
}

const OgLinkComponent: React.FC<OgLinkComponentProps> = ({
  name,
  onChange,
  value,
  intlLabel,
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { post } = useFetchClient();

  // Defensively access the label
  const label = intlLabel ? intlLabel.defaultMessage : 'OG Link';

  // Safely parse the value, which can be a string (from fetch) or an object (from Strapi)
  let data = null;
  if (value) {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object' && parsed !== null) {
          data = parsed;
        }
      } catch (e) {
        console.error("Failed to parse JSON for og-link component:", e);
      }
    } else if (typeof value === 'object' && value !== null) {
      // Value is already an object, use it directly
      data = value;
    }
  }

  const handleFetch = async () => {
    if (!url) {
      setError('Please enter a URL.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await post('/og-pretty-link/fetch-url', { url });
      onChange({
        target: { name, value: JSON.stringify(response.data, null, 2) },
      });
    } catch (err) {
      setError('An unexpected error occurred. Check the server logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography fontWeight="bold">{label}</Typography>
      <Box paddingTop={2} paddingBottom={2}>
        <Typography variant="pi" textColor="neutral600">
          Enter a URL to fetch its Open Graph data and display a preview card.
        </Typography>
      </Box>

      {/* Show the input field only if there is no data */}
      {!data && (
        <Flex gap={2}>
          <TextInput
            placeholder="https://www.strapi.io"
            aria-label="URL input"
            name="url"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
            value={url}
          />
          <Button onClick={handleFetch} loading={loading}>
            Fetch
          </Button>
        </Flex>
      )}

      {error && (
        <Box paddingTop={2}>
          <Typography textColor="danger600" variant="pi">
            {error}
          </Typography>
        </Box>
      )}

      {/* Show the preview card and a 'Clear' button if there is data */}
      {data && (
        <>
          <Box
            marginTop={4}
            padding={4}
            borderColor="neutral200"
            hasRadius
            shadow="tableShadow"
          >
            <Flex direction="column" spacing={2}>
              {data.image && (
                <img
                  src={data.image}
                  alt="Open Graph Image"
                  style={{ width: '100%', borderRadius: '4px' }}
                />
              )}
              <Typography variant="alpha" fontWeight="bold">{data.title}</Typography>
              <Typography>{data.description}</Typography>
              <Link href={data.url} isExternal>
                {data.url}
              </Link>
            </Flex>
          </Box>
          <Box paddingTop={2}>
            <Button
              variant="tertiary"
              onClick={() => {
                onChange({ target: { name, value: JSON.stringify(null) } });
              }}
            >
              Clear
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default OgLinkComponent;
