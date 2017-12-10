<?php
/**
 * Plugin Name:        Plugin Boilerplate
 * Plugin URI:         @@plugin_uri
 * Description:        @@description
 * Author:             @@author
 * Author URI:         @@author_uri
 * Version:            @@version
 * License:            GPL-2.0+
 * License URI:        http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:        @@textdomain
 * Domain Path:        /languages
 * Requires at least:  @@requires
 * Tested up to:       @@tested_up_to
 *
 * @@name is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * @@name is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with @@name. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package @@name
 * @author  @@author
 * @since   1.0.0
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Check the minimum required PHP version.
 *
 * @since 1.0.0
 */

$min_php = '5.6.0';

if ( ! version_compare( PHP_VERSION, $min_php, '>=' ) ) {
	return false;
}

include_once 'lib/autoload.php';

/**
 * The code that runs during plugin activation.
 * This action is documented in lib/Activator.php
 */
register_activation_hook( __FILE__, '\ThatPluginCompany\PluginNamespace\Activator::activate' );

/**
 * The code that runs during plugin deactivation.
 * This action is documented in lib/Deactivator.php
 */
register_deactivation_hook( __FILE__, '\ThatPluginCompany\PluginNamespace\Deactivator::deactivate' );

/**
 * Run the plugin.
 *
 * @since 1.0.0
 */

add_action( 'plugins_loaded', function () {
	$plugin = new \ThatPluginCompany\PluginNamespace\Plugin();
	$plugin->run();
} );
