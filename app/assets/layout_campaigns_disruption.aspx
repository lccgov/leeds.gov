<%@ Page language="C#" Inherits="Microsoft.SharePoint.Publishing.PublishingLayoutPage,Microsoft.SharePoint.Publishing,Version=15.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>                                 <%@ Register Tagprefix="SharePointWebControls" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>                                 <%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>                                 <%@ Register Tagprefix="PublishingWebControls" Namespace="Microsoft.SharePoint.Publishing.WebControls" Assembly="Microsoft.SharePoint.Publishing, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>                                 <%@ Register Tagprefix="PublishingNavigation" Namespace="Microsoft.SharePoint.Publishing.Navigation" Assembly="Microsoft.SharePoint.Publishing, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>                                 <%@ Register Tagprefix="Taxonomy" Namespace="Microsoft.SharePoint.Taxonomy" Assembly="Microsoft.SharePoint.Taxonomy, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>                                 <%@ Register TagPrefix="LatestNews" Namespace="Microsoft.Office.Server.Search.WebControls" Assembly="Microsoft.Office.Server.Search, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c"%>                                 <asp:Content ContentPlaceholderID="PlaceHolderAdditionalPageHead" runat="server">                                     <SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>                                     <PublishingWebControls:EditModePanel runat="server">                                         <!-- Styles for edit mode only-->                                         <SharePointWebControls:CssRegistration name="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/editmode15.css %>"                                             After="<% $SPUrl:~sitecollection/Style Library/~language/Themable/Core Styles/pagelayouts15.css %>" runat="server"/>                                     </PublishingWebControls:EditModePanel>                                 </asp:Content>                                 <asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">                                     <SharePointWebControls:FieldValue FieldName="Title" runat="server"/>                                 </asp:Content>                                 <asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">                                     <SharePointWebControls:FieldValue FieldName="Title" runat="server" />                                 </asp:Content>                                 <asp:Content ContentPlaceHolderId="PlaceHolderPageDescription" runat="server">                                     <SharePointWebControls:ProjectProperty Property="Description" runat="server"/>                                 </asp:Content>                                 <asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">

	<div class="multi-page-template campaign disruption" id="main" role="main">

		<WebPartPages:WebPartZone runat="server" Title="sectionOneTop" AllowPersonalization="false" ID="placeholdersectionOneTop" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>	
		
		<section class="sectionOne">

			<div class="container-fluid">	

				<div class="row">

					<div class="col-xs-12 col-sm-7 col-sm-push-1 col-md-7">

						<div class="campaign-header">
							<h1 class="campaign-header-title"><SharePointWebControls:TextField FieldName="fa564e0f-0c70-4ab9-b863-0177e6ddd247" runat="server" /></h1> 						
							<div class="campaign-header-text"><PublishingWebControls:RichHtmlField FieldName="86091a6f-b67f-4a54-9cac-29ad01dd127d" runat="server"></PublishingWebControls:RichHtmlField></div>
						</div>
						
						<div class="text">
							<PublishingWebControls:RichHtmlField FieldName="f55c4d88-1f2e-4ad9-aaa8-819af4ee7ee8" runat="server"></PublishingWebControls:RichHtmlField> 
						</div>
					
					</div>

				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-10 col-sm-push-1 col-md-10">
					
						<WebPartPages:WebPartZone runat="server" Title="sectionOneFullOne" AllowPersonalization="false" ID="placeholdersectionOneFullOne" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
				
				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-7 col-sm-push-1 col-md-7">

						<WebPartPages:WebPartZone runat="server" Title="sectionOneOneThirdOne" AllowPersonalization="false" ID="placeholdersectionOneOneThirdOne" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
					
				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-10 col-sm-push-1 col-md-10">
					
						<WebPartPages:WebPartZone runat="server" Title="sectionOneFullTwo" AllowPersonalization="false" ID="placeholdersectionOneFullTwo" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
				
				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-7 col-sm-push-1 col-md-7">

						<WebPartPages:WebPartZone runat="server" Title="sectionOneOneThirdTwo" AllowPersonalization="false" ID="placeholdersectionOneOneThirdTwo" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
					
				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-10 col-sm-push-1 col-md-10">
					
						<WebPartPages:WebPartZone runat="server" Title="sectionOneFullThree" AllowPersonalization="false" ID="placeholdersectionOneFullThree" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
				
				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-7 col-sm-push-1 col-md-7">

						<WebPartPages:WebPartZone runat="server" Title="sectionOneOneThirdThree" AllowPersonalization="false" ID="placeholdersectionOneOneThirdThree" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
					
				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-10 col-sm-push-1 col-md-10">
					
						<WebPartPages:WebPartZone runat="server" Title="sectionOneFullFour" AllowPersonalization="false" ID="placeholdersectionOneFullFour" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
				
				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-7 col-sm-push-1 col-md-7">

						<WebPartPages:WebPartZone runat="server" Title="sectionOneOneThirdFour" AllowPersonalization="false" ID="placeholdersectionOneOneThirdFour" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
					
				</div>
				<div class="row">

					<div class="col-xs-12 col-sm-10 col-sm-push-1 col-md-10">
					
						<WebPartPages:WebPartZone runat="server" Title="sectionOneFullFive" AllowPersonalization="false" ID="placeholdersectionOneFullFive" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
				
				</div>

				<div class="row">

					<div class="col-xs-12 col-sm-7 col-sm-push-1 col-md-7">

						<WebPartPages:WebPartZone runat="server" Title="sectionOneOneThirdFive" AllowPersonalization="false" ID="placeholdersectionOneOneThirdFive" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>
					
					</div>
					
				</div>

			</div>

		</section>

		<WebPartPages:WebPartZone runat="server" Title="sectionTwoFull" AllowPersonalization="false" ID="placeholdersectionTwoFull" FrameType="TitleBarOnly" Orientation="Vertical"><ZoneTemplate></ZoneTemplate></WebPartPages:WebPartZone>

		<section>      
			<div class="container-fluid">                                 <div class="row editPanel">                                     <div class="col-md-12">                                         <PublishingWebControls:EditModePanel runat=server id="EditModePanel1">                                             <Taxonomy:TaxonomyFieldControl FieldName="PageCategory" runat="server"></Taxonomy:TaxonomyFieldControl>                                         </PublishingWebControls:EditModePanel>                                     </div>                                 </div>                               </div>
		</section>

	</div>

</asp:Content>