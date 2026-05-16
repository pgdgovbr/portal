import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: './schema.graphql',
	generates: {
		'src/lib/gql/graphql.ts': {
			plugins: ['typescript'],
			config: {
				scalars: {
					Date: 'string',
					DateTime: 'string',
					UUID: 'string'
				}
			}
		}
	}
};

export default config;
