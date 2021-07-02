import classnames from 'classnames';
import metadata from './block.json';
const { registerBlockType } = wp.blocks;
const { InnerBlocks, useBlockProps, InspectorControls, RichText, ColorPalette,
	getColorObjectByColorValue } = wp.blockEditor;
const { useSelect, useDispatch } = wp.data;
const { Fragment } = wp.element;
const { PanelBody, PanelRow, ToggleControl, Placeholder } = wp.components;

const TEMPLATE = [
	[ 'core/paragraph', { textColor: 'orange', fontSize: 18, placeholder: 'Write the page subheader' } ],
	[ 'core/paragraph', {} ],
];
const { name, ...rest } = metadata;
registerBlockType( name, {
	...rest,
	edit: function Edit( { attributes, setAttributes } ) {
		const { currentPost, featuredImage, colors } = useSelect( ( select ) => {
			// // eslint-disable-next-line no-shadow
			const settings = select( 'core/block-editor' ).getSettings();
			console.log( settings );
			// const featuredImageId = select( 'core/editor' ).getEditedPostAttribute( 'featured_media' );
			// // eslint-disable-next-line no-shadow
			// const featuredImageObj = select( 'core' ).getMedia( featuredImageId );
			// //console.log( { props, currentPost, featuredImageObj } );
			return {
				colors: settings.colors,
				currentPost: select( 'core/editor' ).getCurrentPost(),
				featuredImage: select( 'core' ).getMedia( select( 'core/editor' ).getEditedPostAttribute( 'featured_media' ) ),
			};
			// return { pageTitle: currentPost.title, currentPost, featuredImageTitle: featuredImageObj.title.rendered, featuredImageUrl: featuredImageObj };
		} );

		const { displayFeaturedImage, align, titleColor } = attributes;
		const { editEntityRecord } = useDispatch( 'core', [ currentPost.title ] );

		const classNames = classnames(
			'page-banner', 'container', 'row', 'flex-column', 'flex-lg-row',
			{ 'justify-content-between': displayFeaturedImage },
			{ [ `text-${ align }` ]: ! displayFeaturedImage },
		);
		const headingClassNames = classnames(
			{
				'col-lg-6': displayFeaturedImage,
				'col-12': ! displayFeaturedImage,
			},
			'align-self-stretch',
		);

		function onTitleChange( value ) {
			editEntityRecord( 'postType', currentPost.type, currentPost.id, { title: value } );
			setAttributes( {
				pageTitle: value,
			} );
		}
		function onColorChange( val ) {
			const { slug , value } = getColorObjectByColorValue( colors, val );
			console.log( slug );
			setAttributes( {
				titleColor: slug,
			} );
		}
		const blockProps = useBlockProps( {
			className: classNames,
		} );
		return (
			<Fragment>
				<section { ...blockProps } >
					<InspectorControls>
						<PanelBody title="Featured Image">
							<PanelRow>
								<ToggleControl checked={ displayFeaturedImage } label="Show Featured Image" onChange={ ( ( val ) => {
									setAttributes( { displayFeaturedImage: val } );
								} ) } />
							</PanelRow>
						</PanelBody>
						<PanelBody title="Title Color Settings">
							<PanelRow>
								<label>
									<p>Heading Color</p>
									<ColorPalette disableCustomColors={ true } colors={ colors } onChange={ onColorChange } />
								</label>
							</PanelRow>
						</PanelBody>
					</InspectorControls>
					<div className={ headingClassNames }>
						<RichText tagName="h1" className={ `has-${ titleColor }-color` } style={ { fontSize: 36 } } value={ currentPost.title } onChange={ onTitleChange } placeholder="Add title" />
						<InnerBlocks template={ TEMPLATE } />
					</div>
					{
						displayFeaturedImage &&
						<div className='col-lg-6'>
							{
								featuredImage
									? <img src={ featuredImage.source_url } alt={ featuredImage.title.rendered } />
									: <Placeholder label="This page does not have a featured image" instructions="To display a featured image, set it from the page meta." />
							}
						</div>
					}
				</section>
			</Fragment>
		);
	},
	save: () => {
		return (
			<InnerBlocks.Content />
		);
	},
} );
