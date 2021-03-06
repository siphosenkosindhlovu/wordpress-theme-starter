import classnames from 'classnames';
import metadata from './block.json';
const { registerBlockType } = wp.blocks;
const { InnerBlocks, useBlockProps, InspectorControls } = wp.blockEditor;
const { useSelect } = wp.data;
// const { Fragment } = wp.element;
const { PanelBody, PanelRow, ToggleControl } = wp.components;
const { date } = wp.date;
const { get } = lodash;
const { name, ...rest } = metadata;
registerBlockType( name, {
	...rest,
	edit: function Edit( { attributes, setAttributes } ) {
		const { postsToShow, showDate, displayFeaturedImage, showAsList } = attributes;
		const { latestPosts } = useSelect( ( select ) => {
			const { getEntityRecords, getEntityRecord } = select( 'core' );
			const postsQuery = {
				per_page: postsToShow,
			};
			const posts = getEntityRecords( 'postType', 'post', postsQuery );

			return {
				latestPosts: ! Array.isArray( posts )
					? posts
					: posts.map( ( post ) => {
						const cats = post.categories.map( ( category ) => {
							const categoryObj = getEntityRecord( 'taxonomy', 'category', category );
							const catName = get(
								categoryObj,
								[ 'name' ],
								null,
							);
							return catName;
						} );
						return {
							...post,
							categories: cats,
						};
					} ),
			};
			// return { pageTitle: currentPost.title, currentPost, featuredImageTitle: featuredImageObj.title.rendered, featuredImageUrl: featuredImageObj };
		} );

		const containerClasses = classnames(
			{ 'row row-cols-md-2 row-cols-lg-3': ! showAsList },
			{ 'd-flex flex-column': showAsList },
		);

		// When I implement the list layout
		// const headingClassNames = classnames(
		// 	{
		// 		'fs-5': showAsList,
		// 		'fs-4': ! showAsList,
		// 	},
		// );
		// const metaClassNames = classnames(
		// 	{
		// 		'fs-5': showAsList,
		// 		'fs-4': ! showAsList,
		// 	},
		// );

		const blockProps = useBlockProps( {
		} );
		return (
			<div { ...blockProps }>
				<InspectorControls>
					<PanelBody title="Featured Image">
						<PanelRow>
							<ToggleControl checked={ displayFeaturedImage } label="Show Featured Image" onChange={ ( ( val ) => {
								setAttributes( { displayFeaturedImage: val } );
							} ) } />
						</PanelRow>
					</PanelBody>
				</InspectorControls>
				<div className={ containerClasses }>
					{
						! latestPosts
							? <p>Loading</p>
							: latestPosts.map( ( post ) =>
								<div className="mb-4" key={ post.id }>
									<article className="card h-100">
										<div className="card-body d-flex flex-column">
											<h3 className="article-title fs-4">
												<a href={ post.link } className="stretched-link fw-normal text-blue">
													{ post.title.raw }
												</a>
											</h3>
											<div className="card-text mt-auto">
												<div className="fs-sm">
													<div>{ Array.isArray( post.categories ) ? post.categories.join( ', ' ) : post.categories }</div>
													<div className="text-accent">
														{ date( 'F j, Y', post.date ) }
													</div>
												</div>
											</div>
										</div>
									</article>
								</div>,
							)
					}
				</div>
			</div>
		);
	},
	save: () => {
		return (
			<InnerBlocks.Content />
		);
	},
} );
