using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kitab.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddOfferedListingToContactRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "OfferedListingId",
                table: "ContactRequests",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RequestType",
                table: "ContactRequests",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ContactRequests_OfferedListingId",
                table: "ContactRequests",
                column: "OfferedListingId");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactRequests_Listings_OfferedListingId",
                table: "ContactRequests",
                column: "OfferedListingId",
                principalTable: "Listings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactRequests_Listings_OfferedListingId",
                table: "ContactRequests");

            migrationBuilder.DropIndex(
                name: "IX_ContactRequests_OfferedListingId",
                table: "ContactRequests");

            migrationBuilder.DropColumn(
                name: "OfferedListingId",
                table: "ContactRequests");

            migrationBuilder.DropColumn(
                name: "RequestType",
                table: "ContactRequests");
        }
    }
}
