import { buildConfig } from 'payload/config';
import path from 'path';
// import Examples from './collections/Examples';
import Users from './collections/Users';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    // Add Collections here
    {
      slug: 'screenings',
      timestamps: false,
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'movie',
          type: 'relationship',
          relationTo: 'movies',
        },
      ],
    },
    {
      slug: 'movies',
      timestamps: false,
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'director',
          type: 'relationship',
          relationTo: 'directors',
        },
      ],
    },
    {
      slug: 'directors',
      timestamps: false,
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
});
