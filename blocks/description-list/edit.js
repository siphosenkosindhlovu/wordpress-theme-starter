const {
	__experimentalUseInnerBlocksProps: useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	useBlockProps,
	getColorObjectByColorValue,
} = wp.blockEditor;
const { Fragment } = wp.element;
const {
	useDispatch,
	useSelect } = wp.data;
const {
	PanelBody,
	PanelRow,
	FontSizePicker } = wp.components;
const ALLOWED_BLOCKS = [ 'paymob/description-list-item' ];
const TEMPLATE = [
	[ 'paymob/description-list-item', {} ],
	[ 'paymob/description-list-item', {} ],
];
export default function Edit( { setAttributes, clientId } ) {
	const blockProps = useBlockProps( {
		className: 'list-description row row-cols-1 row-cols-md-2 row-cols-lg-3',
	} );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		orientation: 'horizontal',
		templateLock: false,
		renderAppender: InnerBlocks.ButtonBlockAppender,
		template: TEMPLATE,
	} );
	const {
		fontSizes, colorPalette, ...settings
	} = useSelect( ( select ) => {
		const editorSettings = select( 'core/block-editor' ).getSettings();
		return {
			fontSizes: editorSettings.fontSizes,
			colorPalette: editorSettings.colors,
			...editorSettings,
		};
	} );
	const blockChildren = useSelect( ( select ) => select( 'core/block-editor' ).getBlocksByClientId( clientId )[ 0 ].innerBlocks );

	const { updateBlockAttributes } = useDispatch( 'core/editor' );

	function setChildrenAttributes( children, attributes ) {
		children.forEach( function( child ) {
			updateBlockAttributes( child.clientId, { ...attributes } );
		} );
	}

	function onChangeColor( color ) {
		if ( color ) {
			const colorObject = getColorObjectByColorValue( settings.colors, color );
			setAttributes( {
				markerColor: colorObject.slug,
			} );
			setChildrenAttributes( blockChildren, {
				markerColor: colorObject.slug,
			} );
		}
	}
	function onChangeHeadingFontSize( fontSize ) {
		setChildrenAttributes( blockChildren, {
			headingFontSize: fontSize,
		} );
	}
	function onChangeDescriptionFontSize( fontSize ) {
		setChildrenAttributes( blockChildren, {
			descriptionFontSize: fontSize,
		} );
	}

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Colour Settings">
					<PanelRow>
						<ColorPalette colors={ colorPalette } onChange={ onChangeColor } />
					</PanelRow>
				</PanelBody>
				<PanelBody title="Typography Settings">
					<p><strong>Description List Heading Font Size</strong></p>
					<PanelRow>
						<FontSizePicker fontSizes={ fontSizes } onChange={ onChangeHeadingFontSize } />
					</PanelRow>
					<p><strong>Description List Body Font Size</strong></p>
					<PanelRow>
						<FontSizePicker fontSizes={ fontSizes } onChange={ onChangeDescriptionFontSize } />
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ul { ...innerBlocksProps } />
		</Fragment>
	);
}
